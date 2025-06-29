import React, { useState, useEffect } from "react";
import { ref, onValue, set, get } from "firebase/database";
import { database, auth } from "../../services/firebaseConfig";
import { Send, Search } from "lucide-react";
import { getTimeDifference } from "../../helper/TimeDiff";

export const ChatList = ({ onSelect, selectedUser }) => {
  const [search, setSearch] = useState("");
  const [conversationUsers, setConversationUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [lastReadTimestamps, setLastReadTimestamps] = useState({});
  const [searchResults, setSearchResults] = useState([]);

  const currentUser = auth.currentUser;

  const fetchAllUsersMatchingSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const allResults = [];

    // Search users
    const usersSnap = await get(ref(database, "users"));
    if (usersSnap.exists()) {
      const usersData = usersSnap.val();
      for (const uid in usersData) {
        if (uid !== currentUser.uid) {
          const name = usersData[uid].fullname || usersData[uid].customId || "";
          if (name.toLowerCase().includes(query.toLowerCase())) {
            allResults.push({
              uid,
              name,
              avatar: usersData[uid].img || usersData[uid].fileUrl || null,
              customId: usersData[uid].customId || "No id found",
              status: "offline",
              lastMessage: null,
              hasConversation: conversationUsers.some((u) => u.uid === uid),
            });
          }
        }
      }
    }

    // Search responders
    const respondersSnap = await get(ref(database, "responders"));
    if (respondersSnap.exists()) {
      const respondersData = respondersSnap.val();
      for (const uid in respondersData) {
        if (uid !== currentUser.uid) {
          const name =
            respondersData[uid].fullname || respondersData[uid].customId || "";
          if (name.toLowerCase().includes(query.toLowerCase())) {
            // Check if this user is already in results (from users collection)
            const existingUser = allResults.find((user) => user.uid === uid);
            if (!existingUser) {
              allResults.push({
                uid,
                name,
                avatar:
                  respondersData[uid].img ||
                  respondersData[uid].fileUrl ||
                  null,
                customId: respondersData[uid].customId || "No id found",
                status: "offline",
                lastMessage: null,
                hasConversation: conversationUsers.some((u) => u.uid === uid),
              });
            }
          }
        }
      }
    }

    // search admins
    const adminSnap = await get(ref(database, "admins"));
    if (adminSnap.exists()) {
      const adminsData = adminSnap.val();
      for (const uid in adminsData) {
        if (uid !== currentUser.uid) {
          const name =
            adminsData[uid].fullname || adminsData[uid].customId || "";
          if (name.toLowerCase().includes(query.toLowerCase())) {
            // Check if this user is already in results (from users collection)
            const existingUser = allResults.find((user) => user.uid === uid);
            if (!existingUser) {
              allResults.push({
                uid,
                name,
                avatar: adminsData[uid].img || adminsData[uid].fileUrl || null,
                customId: adminsData[uid].customId || "No id found",
                status: "offline",
                lastMessage: null,
                hasConversation: conversationUsers.some((u) => u.uid === uid),
              });
            }
          }
        }
      }
    }

    setSearchResults(allResults);
  };

  // Helper function to get user details
  const getUserDetails = async (userId) => {
    if (userId === "test-user-123") {
      return {
        uid: "test-user-123",
        name: "🤖 Test Bot",
        avatar: null,
        customId: "Test Bot",
        status: "online",
      };
    }

    try {
      // Try users collection first
      let userSnapshot = await get(ref(database, `users/${userId}`));
      let userData = null;

      if (userSnapshot.exists()) {
        userData = userSnapshot.val();
      } else {
        // Try responders collection
        userSnapshot = await get(ref(database, `responders/${userId}`));
        if (userSnapshot.exists()) {
          userData = userSnapshot.val();
        } else {
          // Try admins collection
          userSnapshot = await get(ref(database, `admins/${userId}`));
          if (userSnapshot.exists()) {
            userData = userSnapshot.val();
          }
        }
      }

      if (userData) {
        return {
          uid: userId,
          name: userData.fullname || userData.customId || userId,
          avatar: userData.img || userData.fileUrl || null,
          customId: userData.customId || "No id found",
          status: "online",
        };
      }

      return {
        uid: userId,
        name: userId,
        avatar: null,
        customId: "Unknown User",
        status: "offline",
      };
    } catch (error) {
      console.error("Error fetching user details:", error);
      return {
        uid: userId,
        name: userId,
        avatar: null,
        customId: "Unknown User",
        status: "offline",
      };
    }
  };

  // Get last message from conversation
  const getLastMessage = (messages) => {
    if (!messages || Object.keys(messages).length === 0) return null;
    const messageArray = Object.values(messages);
    return messageArray.sort((a, b) => b.timestamp - a.timestamp)[0];
  };

  // Count unread messages for a conversation
  const countUnreadMessages = (messages, lastReadTimestamp, otherUserId) => {
    if (!messages) return 0;
    const messageArray = Object.values(messages);
    return messageArray.filter(
      (msg) =>
        msg.sender === otherUserId && msg.timestamp > (lastReadTimestamp || 0)
    ).length;
  };

  useEffect(() => {
    if (!currentUser) return;

    // Listen to last read timestamps
    const lastReadRef = ref(database, `lastRead/${currentUser.uid}`);
    const unsubscribeLastRead = onValue(lastReadRef, (snapshot) => {
      const data = snapshot.exists() ? snapshot.val() : {};
      setLastReadTimestamps(data);
    });

    // Listen to all conversations
    const userChatsRef = ref(database, `chats/${currentUser.uid}`);
    const unsubscribeChats = onValue(userChatsRef, async (snapshot) => {
      if (!snapshot.exists()) {
        setConversationUsers([]);
        setUnreadCounts({});
        return;
      }

      const conversations = snapshot.val();
      const userIds = Object.keys(conversations);

      // Fetch user details for all conversation partners
      const userPromises = userIds.map(async (userId) => {
        const userDetails = await getUserDetails(userId);
        const lastMessage = getLastMessage(conversations[userId]);

        return {
          ...userDetails,
          lastMessage,
        };
      });

      const users = await Promise.all(userPromises);

      // Sort by last message timestamp
      const sortedUsers = users
        .filter((user) => user !== null)
        .sort(
          (a, b) =>
            (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0)
        );

      setConversationUsers(sortedUsers);

      // Calculate unread counts
      const newUnreadCounts = {};
      userIds.forEach((userId) => {
        const messages = conversations[userId];
        const lastRead = lastReadTimestamps[userId] || 0;
        newUnreadCounts[userId] = countUnreadMessages(
          messages,
          lastRead,
          userId
        );
      });

      setUnreadCounts(newUnreadCounts);
    });

    return () => {
      unsubscribeLastRead();
      unsubscribeChats();
    };
  }, [currentUser, lastReadTimestamps]);

  // Update search results when search changes or conversationUsers change
  useEffect(() => {
    fetchAllUsersMatchingSearch(search);
  }, [search, conversationUsers]);

  const getAvatarInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };


  const handleUserSelect = async (user) => {
    onSelect(user);

    // Mark messages as read when selecting a conversation
    if (unreadCounts[user.uid] > 0) {
      const lastReadRef = ref(
        database,
        `lastRead/${currentUser.uid}/${user.uid}`
      );
      await set(lastReadRef, Date.now());
    }
  };

  // Filter conversation users based on search
  const getFilteredConversationUsers = () => {
    if (!search.trim()) return conversationUsers;
    return conversationUsers.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  };

  // Get users without conversations from search results
  const getUsersWithoutConversations = () => {
    if (!search.trim()) return [];
    return searchResults.filter((user) => !user.hasConversation);
  };

  const filteredConversationUsers = getFilteredConversationUsers();
  const usersWithoutConversations = getUsersWithoutConversations();

  return (
    <div
      className={`${
        selectedUser ? "hidden lg:flex" : "flex"
      } w-full lg:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 flex flex-col`}
    >
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-bold text-xl text-gray-800 dark:text-gray-400 mb-4">
          Messages
        </h2>
        {/** Search bar */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-300 focus:border-transparent outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Show message when no conversations exist and no search */}
        {conversationUsers.length === 0 && !search ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-gray-500">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <Send size={32} className="text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 dark:text-gray-400 mb-1">
              No Conversations
            </h3>
            <p className="text-sm text-gray-500 dark:texy-gray-300 text-center px-4">
              You don't have any conversations yet. Start chatting to see them
              here.
            </p>
          </div>
        ) : (
          <>
            {/* Conversation Users Section */}
            {filteredConversationUsers.length > 0 && (
              <div>
                {search && (
                  <h4 className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
                    Conversations
                  </h4>
                )}
                {filteredConversationUsers.map((user) => {
                  const unreadCount = unreadCounts[user.uid] || 0;
                  const hasUnread = unreadCount > 0;

                  return (
                    <div
                      key={user.uid}
                      className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 border-b border-gray-100 ${
                        selectedUser?.uid === user.uid
                          ? "bg-blue-50 dark:bg-gray-900 border-l-4 border-l-blue-500 dark:border-l-blue-400"
                          : ""
                      } ${hasUnread ? "bg-blue-25 dark:bg-blue-50" : ""}`}
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {!user.avatar ? (
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                              {getAvatarInitials(user.name)}
                            </div>
                          ) : (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              loading="lazy"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                          {user.status === "online" && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3
                              className={`font-medium truncate ${
                                hasUnread
                                  ? "text-gray-900 dark:text-gray-500"
                                  : "text-gray-700 dark:text-gray-400"
                              }`}
                            >
                              {user.uid === currentUser.uid ? (
                                <>
                                  {user.name}{" "}
                                  <span className="text-blue-500 font-semibold text-xs">
                                    (You)
                                  </span>
                                </>
                              ) : (
                                user.name
                              )}
                            </h3>

                            <div className="flex items-center gap-2">
                              {user.lastMessage && (
                                <span className="text-xs text-gray-500">
                                  {getTimeDifference(
                                    user.lastMessage.timestamp
                                  )}
                                </span>
                              )}
                              {hasUnread && (
                                <div className="bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem]">
                                  {unreadCount > 99 ? "99+" : unreadCount}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <p
                              className={`text-sm truncate ${
                                hasUnread
                                  ? "text-gray-900 dark:text-gray-700 font-medium"
                                  : "text-gray-500 dark:text-gray-300"
                              }`}
                            >
                              {user.lastMessage ? (
                                <span className="text-xs">
                                  {user.lastMessage.sender === currentUser.uid && "You:"}
                                  {user.lastMessage.text.length > 30 ? `${user.lastMessage.text.substring(0,30)}...`
                                    : user.lastMessage.text
                                    }
                                </span>
                              ) : (
                                <span className="text-xs">No Messages Yet</span>
                              )}
                            </p>
                            {hasUnread && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Users Without Conversations Section */}
            {search && usersWithoutConversations.length > 0 && (
              <div
                className={
                  filteredConversationUsers.length > 0
                    ? "border-t border-gray-200"
                    : ""
                }
              >
                <h4 className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
                  Other Users
                </h4>
                {usersWithoutConversations.map((user) => (
                  <div
                    key={user.uid}
                    className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 border-b border-gray-100"
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {!user.avatar ? (
                          <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white dark:text-gray-400 font-medium">
                            {getAvatarInitials(user.name)}
                          </div>
                        ) : (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                            loading="lazy"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate text-gray-700 dark:text-gray-500">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-400 dark:text-gray-300">
                          No messages yet
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results Message */}
            {search &&
              filteredConversationUsers.length === 0 &&
              usersWithoutConversations.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full py-12 text-gray-500">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-300 rounded-full flex items-center justify-center mb-4">
                    <Search
                      size={32}
                      className="text-gray-400 dark:text-gray-500"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-400 mb-1">
                    No Users Found
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300 text-center px-4">
                    No users match your search "{search}"
                  </p>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
};