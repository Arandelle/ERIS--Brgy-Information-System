import React, { useState, useEffect, useRef } from "react";
import { ref, onValue, push, get, set } from "firebase/database";
import { database, auth } from "../services/firebaseConfig";
import HeaderAndSideBar from "../components/ReusableComponents/HeaderSidebar";
import { Send, Search, ChevronLeft } from "lucide-react";

const TestUserChatSimulator = () => {
  const [testText, setTestText] = useState("");
  const [testUserId] = useState("test-user-123");
  const currentUser = auth.currentUser;

  const handleSendTestMessage = async () => {
    if (!currentUser || !testText.trim()) return;

    const message = {
      sender: testUserId,
      text: testText,
      timestamp: Date.now(),
    };

    const userRef = ref(database, `chats/${testUserId}/${currentUser.uid}`);
    const mirroredRef = ref(database, `chats/${currentUser.uid}/${testUserId}`);

    await push(userRef, message);
    await push(mirroredRef, message);

    setTestText("");
  };

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 m-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
        <h3 className="font-semibold text-amber-800">Test Bot Simulator</h3>
      </div>
      <p className="text-sm text-amber-700 mb-3">
        Send a message as Test Bot to {currentUser?.email}
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type test message..."
          className="flex-1 px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-transparent outline-none"
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendTestMessage()}
        />
        <button
          onClick={handleSendTestMessage}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <Send size={16} />
          Send
        </button>
      </div>
    </div>
  );
};

const MessageBubble = ({ text, isOwn, timestamp }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4 px-4`}
    >
      <div
        className={`flex flex-col max-w-xs lg:max-w-lg text-wrap ${
          isOwn ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`px-4 py-2 rounded-2xl relative ${
            isOwn
              ? "bg-blue-500 text-white rounded-br-md"
              : "bg-gray-100 text-gray-800 rounded-bl-md"
          } shadow-sm`}
        >
          <p className="text-sm leading-relaxed break-words overflow-hidden max-w-lg">
            {text}
          </p>
        </div>
        <span className="text-xs text-gray-500 mt-1 px-2">
          {formatTime(timestamp)}
        </span>
      </div>
    </div>
  );
};

const ChatList = ({ onSelect, selectedUser }) => {
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
                  respondersData[uid].img || respondersData[uid].fileUrl || null,
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

  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return "";
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      return messageDate.toLocaleDateString([], { weekday: "short" });
    } else {
      return messageDate.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
    }
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
      } w-full lg:w-80 bg-white border-r border-gray-200 flex flex-col`}
    >
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-bold text-xl text-gray-800 mb-4">Messages</h2>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-300 focus:border-transparent outline-none"
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
            <h3 className="font-medium text-gray-900 mb-1">No Conversations</h3>
            <p className="text-sm text-gray-500 text-center px-4">
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
                  <h4 className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50">
                    Conversations
                  </h4>
                )}
                {filteredConversationUsers.map((user) => {
                  const unreadCount = unreadCounts[user.uid] || 0;
                  const hasUnread = unreadCount > 0;

                  return (
                    <div
                      key={user.uid}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 ${
                        selectedUser?.uid === user.uid
                          ? "bg-blue-50 border-l-4 border-l-blue-500"
                          : ""
                      } ${hasUnread ? "bg-blue-25" : ""}`}
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
                                hasUnread ? "text-gray-900" : "text-gray-700"
                              }`}
                            >
                              {user.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              {user.lastMessage && (
                                <span className="text-xs text-gray-500">
                                  {formatLastMessageTime(user.lastMessage.timestamp)}
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
                                  ? "text-gray-900 font-medium"
                                  : "text-gray-500"
                              }`}
                            >
                              {user.lastMessage
                                ? user.lastMessage.text.length > 30
                                  ? `${user.lastMessage.text.substring(0, 30)}...`
                                  : user.lastMessage.text
                                : "No messages yet"}
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
              <div className={filteredConversationUsers.length > 0 ? "border-t border-gray-200" : ""}>
                <h4 className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50">
                  Other Users
                </h4>
                {usersWithoutConversations.map((user) => (
                  <div
                    key={user.uid}
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100"
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {!user.avatar ? (
                          <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-medium">
                            {getAvatarInitials(user.name)}
                          </div>
                        ) : (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate text-gray-700">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-400">No messages yet</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results Message */}
            {search && filteredConversationUsers.length === 0 && usersWithoutConversations.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full py-12 text-gray-500">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">No Users Found</h3>
                <p className="text-sm text-gray-500 text-center px-4">
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

const ChatWindow = ({ selectedUser, setSelectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);
  const user = auth.currentUser;
  const lastMessageRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark messages as read when viewing conversation
  useEffect(() => {
    if (!selectedUser || !user) return;

    const markAsRead = async () => {
      const lastReadRef = ref(
        database,
        `lastRead/${user.uid}/${selectedUser.uid}`
      );
      await set(lastReadRef, Date.now());
    };

    // Mark as read when opening conversation
    markAsRead();

    // Mark as read when new messages arrive (if user is viewing the conversation)
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        markAsRead();
      }, 1000); // Small delay to ensure user has seen the message

      return () => clearTimeout(timer);
    }
  }, [selectedUser, user, messages]);

  useEffect(() => {
    if (!user || !selectedUser) return;

    const chatRef = ref(database, `chats/${user.uid}/${selectedUser.uid}`);
    return onValue(chatRef, (snapshot) => {
      const data = snapshot.val() || {};
      const sorted = Object.values(data).sort(
        (a, b) => a.timestamp - b.timestamp
      );
      setMessages(sorted);
    });
  }, [selectedUser, user]);

  const handleSend = async () => {
    if (!text.trim() || !user) return;

    const message = {
      sender: user.uid,
      text: text.trim(),
      timestamp: Date.now(),
    };

    const userRef = ref(database, `chats/${user.uid}/${selectedUser.uid}`);
    const mirroredRef = ref(database, `chats/${selectedUser.uid}/${user.uid}`);

    await push(userRef, message);
    await push(mirroredRef, message);
    setText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getAvatarInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center gap-1">
            <button
              onClick={() => setSelectedUser(null)}
              className="flex lg:hidden"
            >
              <ChevronLeft size={24} />
            </button>
            {!selectedUser.avatar ? (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                {getAvatarInitials(selectedUser.name)}
              </div>
            ) : (
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            {selectedUser.status === "online" && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-gray-900">{selectedUser.name}</h3>
            <h3 className="font-semibold text-gray-500 text-xs">
              {selectedUser.customId}
            </h3>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="py-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-gray-500">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {getAvatarInitials(selectedUser.name)}
                </div>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">
                {selectedUser.name}
              </h3>
              <p className="text-sm text-gray-500">Start your conversation</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <MessageBubble
                key={idx}
                text={msg.text}
                isOwn={msg.sender === user?.uid}
                timestamp={msg.timestamp}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="px-4 py-4 bg-white border-t border-gray-200">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl resize-none focus:ring-2 focus:ring-blue-300 focus:border-transparent outline-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              style={{
                minHeight: "44px",
                height: "auto",
              }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className={`p-3 rounded-full transition-all duration-200 mb-1 ${
              text.trim()
                ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ChatSystem = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <HeaderAndSideBar
      content={
        <div className="flex flex-col h-screen bg-gray-100">
          <div className={`flex flex-1 min-h-0`}>
            <ChatList onSelect={setSelectedUser} selectedUser={selectedUser} />
            {selectedUser ? (
              <div
                className={`flex-1 flex-col min-w-0 ${
                  selectedUser ? "flex" : "hidden"
                }`}
              >
                <ChatWindow
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                />
              </div>
            ) : (
              <div
                className={`flex-1 hidden lg:flex items-center justify-center bg-white`}
              >
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Your Messages
                  </h3>
                  <p className="text-gray-500 max-w-sm">
                    Select a conversation from the sidebar to start chatting
                    with your contacts.
                  </p>
                </div>
              </div>
            )}
          </div>
          {/* <TestUserChatSimulator /> */}
        </div>
      }
    />
  );
};

export default ChatSystem;
