import React, { useState, useEffect, useRef } from "react";
import { ref, onValue, push, set, update, remove } from "firebase/database";
import { database, auth } from "../../services/firebaseConfig";
import { Send, ChevronLeft, X, Check, Trash} from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { toast } from "sonner";
import { Tooltip } from "@mui/material";

export const ChatWindow = ({ selectedUser, setSelectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [text, setText] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isEditing, setIsEditing] = useState(null); // ID of message being edited
  const [originalText, setOriginalText] = useState(""); // Store original text for cancel
  const messagesContainerRef = useRef(null);
  const user = auth.currentUser;
  const lastMessageRef = useRef(null);
  const isScrollingToLoad = useRef(false);
  const previousScrollHeight = useRef(0);
  

  const [openMenuId, setOpenMenuId] = useState(null);

  const MESSAGES_PER_PAGE = 20;
  const SCROLL_THRESHOLD = 100;

  // Store original text when editing starts
  useEffect(() => {
    if (isEditing && !originalText) {
      const messageToEdit = messages.find((msg) => msg.id === isEditing);
      if (messageToEdit) {
        setOriginalText(messageToEdit.text);
      }
    }
  }, [isEditing, messages, originalText]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }

    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  const isNearBottom = () => {
    if (!messagesContainerRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < 100;
  };

  const loadMoreMessages = () => {
    if (isLoadingMore || !hasMoreMessages) return;

    setIsLoadingMore(true);
    isScrollingToLoad.current = true;

    const currentMessageCount = messages.length;
    const nextBatch = allMessages.slice(
      Math.max(0, allMessages.length - currentMessageCount - MESSAGES_PER_PAGE),
      allMessages.length - currentMessageCount
    );

    if (nextBatch.length === 0) {
      setHasMoreMessages(false);
      setIsLoadingMore(false);
      isScrollingToLoad.current = false;
      return;
    }

    if (messagesContainerRef.current) {
      previousScrollHeight.current = messagesContainerRef.current.scrollHeight;
    }

    setTimeout(() => {
      setMessages((prev) => [...nextBatch, ...prev]);
      setIsLoadingMore(false);

      setTimeout(() => {
        if (messagesContainerRef.current) {
          const newScrollHeight = messagesContainerRef.current.scrollHeight;
          const scrollDifference =
            newScrollHeight - previousScrollHeight.current;
          messagesContainerRef.current.scrollTop = scrollDifference;
        }
        isScrollingToLoad.current = false;
      }, 50);
    }, 500);
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current || isLoadingMore) return;

    const { scrollTop } = messagesContainerRef.current;

    if (scrollTop < SCROLL_THRESHOLD && hasMoreMessages) {
      loadMoreMessages();
    }
  };

  useEffect(() => {
    if (selectedUser) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (!selectedUser || !user) return;

    const markAsRead = async () => {
      const lastReadRef = ref(
        database,
        `lastRead/${user.uid}/${selectedUser.uid || selectedUser.id}`
      );
      await set(lastReadRef, Date.now());
    };

    markAsRead();

    if (messages.length > 0) {
      const timer = setTimeout(() => {
        markAsRead();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [selectedUser, user, messages]);

  useEffect(() => {
    if (!user || !selectedUser) return;

    const chatRef = ref(
      database,
      `chats/${user.uid}/${selectedUser?.uid || selectedUser?.id}`
    );

    return onValue(chatRef, (snapshot) => {
      const data = snapshot.val() || {};

      const messagesWithIds = Object.entries(data).map(([id, message]) => ({
        id,
        ...message,
      }));

      const sorted = messagesWithIds.sort((a, b) => a.timestamp - b.timestamp);

      setAllMessages(sorted);

      const latestMessages = sorted.slice(-MESSAGES_PER_PAGE);
      setMessages(latestMessages);

      setHasMoreMessages(sorted.length > MESSAGES_PER_PAGE);

      setIsLoadingMore(false);
      isScrollingToLoad.current = false;
    });
  }, [selectedUser, user]);

  useEffect(() => {
    if (allMessages.length === 0) return;

    const latestMessage = allMessages[allMessages.length - 1];
    const isNewMessage = !messages.some(
      (msg) =>
        msg.timestamp === latestMessage?.timestamp &&
        msg.sender === latestMessage?.sender
    );

    if (isNewMessage && latestMessage) {
      const isShowingLatest =
        messages.length > 0 &&
        messages[messages.length - 1].timestamp ===
          allMessages[allMessages.length - 2]?.timestamp;

      if (isShowingLatest || messages.length === 0) {
        const wasNearBottom = isNearBottom();

        setMessages((prev) => {
          const exists = prev.some(
            (msg) =>
              msg.timestamp === latestMessage.timestamp &&
              msg.sender === latestMessage.sender
          );

          return exists ? prev : [...prev, latestMessage];
        });

        if (wasNearBottom || latestMessage.sender === user?.uid) {
          setTimeout(() => {
            scrollToBottom();
          }, 50);
        }
      }
    }
  }, [allMessages, user]);

  const handleSend = async () => {
    if (!text.trim() || !user) return;

    // If we're editing, handle the edit instead
    if (isEditing) {
      await handleEditMessage();
      return;
    }

    const messageId = push(ref(database, "temp")).key;

    const message = {
      sender: user.uid,
      text: text.trim(),
      timestamp: Date.now(),
    };

    const userRef = ref(
      database,
      `chats/${user.uid}/${selectedUser.uid || selectedUser.id}/${messageId}`
    );
    const mirroredRef = ref(
      database,
      `chats/${selectedUser.uid || selectedUser.id}/${user.uid}/${messageId}`
    );

    await set(userRef, message);

    if (selectedUser.uid !== user.uid) {
      await set(mirroredRef, message);
    }

    setText("");

    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const handleEditMessage = async () => {
    if (!text.trim() || !isEditing) return;

    try {
      const selectedUserId = selectedUser.uid || selectedUser.id;

      const currentUserMsgRef = ref(
        database,
        `chats/${user.uid}/${selectedUserId}/${isEditing}`
      );
      const selectedUserMsgRef = ref(
        database,
        `chats/${selectedUserId}/${user.uid}/${isEditing}`
      );

      const updateData = {
        text: text.trim(),
        editedAt: Date.now(),
        isEdited: true,
      };

      await Promise.all([
        update(currentUserMsgRef, updateData),
        update(selectedUserMsgRef, updateData),
      ]);

      toast.success("Message edited successfully");
      handleCancelEdit();
    } catch (error) {
      console.error("Error editing message:", error);
      toast.error("Failed to edit message. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setOriginalText("");
    setText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === "Escape" && isEditing) {
      handleCancelEdit();
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

  const handleDeleteMsg = async (messageId, isDirectDelete) => {
    try {
      if (!user?.uid || (!selectedUser?.uid && !selectedUser?.id)) {
        toast.error("Unable to delete message - missing user information");
        return;
      }

      if (!messageId) {
        toast.error("Unable to delete message - invalid message ID");
        return;
      }

      const selectedUserId = selectedUser.uid || selectedUser.id;

      if (isDirectDelete) {
        const currentUserMsgRef = ref(
          database,
          `chats/${user.uid}/${selectedUserId}/${messageId}`
        );

        await remove(currentUserMsgRef);

        toast.success("Message removed from your chat");
        setOpenMenuId(null);
        return;
      }

      const currentUserMsgRef = ref(
        database,
        `chats/${user.uid}/${selectedUserId}/${messageId}`
      );
      const selectedUserMsgRef = ref(
        database,
        `chats/${selectedUserId}/${user.uid}/${messageId}`
      );

      await Promise.all([
        update(currentUserMsgRef, {
          text: "unsent a message",
          isDeleted: true,
          deletedAt: Date.now(),
          deletedBy: user.uid,
        }),
        update(selectedUserMsgRef, {
          text: "unsent a message",
          isDeleted: true,
          deletedAt: Date.now(),
          deletedBy: user.uid,
        }),
      ]);

      toast.success("Message deleted successfully");
      setOpenMenuId(null);
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message. Please try again.");
    }
  };

  const handleDeleteChat = async () => {
    if (!window.confirm("Are you sure you want to delete this conversation?")) {
      return;
    }

    if (!user?.uid || !selectedUser?.uid) {
      toast.error("Unable to delete chat - missing user information");
      return;
    }

    try {
      const currentUserChatRef = ref(
        database,
        `chats/${user.uid}/${selectedUser.uid}`
      );
      const selectedUserChatRef = ref(
        database,
        `chats/${selectedUser.uid}/${user.uid}`
      );

      await Promise.all([
        remove(currentUserChatRef),
        remove(selectedUserChatRef),
      ]);

      toast.success("Chat deleted successfully");
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white dark:bg-gray-800">
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
                loading="lazy"
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            {selectedUser.status === "online" && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-gray-900 dark:text-gray-500">
              {selectedUser.uid === user.uid ? (
                <>
                  {selectedUser.name}{" "}
                  <span className="text-blue-500 font-semibold text-xs">
                    (You)
                  </span>
                </>
              ) : (
                selectedUser.name
              )}
            </h3>
            <h3 className="font-semibold text-gray-500 dark:text-gray-400 text-xs">
              {selectedUser.customId}
            </h3>
          </div>
        </div>

        <button onClick={handleDeleteChat}>
          <Tooltip title="Delete Conversation" placement="bottom">
            <Trash size={18} className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500" />
          </Tooltip>
        </button>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900"
        onScroll={handleScroll}
      >
        <div className="py-4">
          {isLoadingMore && (
            <div className="flex justify-center py-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                Loading more messages...
              </div>
            </div>
          )}

          {!isLoadingMore && hasMoreMessages && messages.length > 0 && (
            <div className="flex justify-center py-2">
              <button
                onClick={loadMoreMessages}
                className="text-blue-500 text-sm hover:text-blue-600 transition-colors"
              >
                Load older messages
              </button>
            </div>
          )}

          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-gray-500">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-500 rounded-full flex items-center justify-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {getAvatarInitials(selectedUser.name)}
                </div>
              </div>
              <h3 className="font-medium text-gray-900 dark:text-gray-400 mb-1">
                {selectedUser.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Start your conversation
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <MessageBubble
                key={`${msg.timestamp}-${msg.sender}-${index}`}
                message={msg}
                isOwn={msg.sender === user?.uid}
                prevTimestamp={index > 0 ? messages[index - 1].timestamp : null}
                ref={index === messages.length - 1 ? lastMessageRef : null}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
                handleDeleteMsg={handleDeleteMsg}
                setText={setText}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
              />
            ))
          )}
        </div>
      </div>

      {/* Edit Mode Banner */}
      {isEditing && (
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900 border-t border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                Editing message
              </span>
            </div>
            <button
              onClick={handleCancelEdit}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="px-4 py-4 bg-white dark:bg-gray-800 border-t border-gray-200">
        <div className="flex items-center justify-end gap-3">
          <div className="flex-1 relative">
            <textarea
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-600 dark:text-gray-200 border border-gray-200 rounded-2xl resize-none focus:ring-2 focus:ring-blue-300 focus:border-transparent outline-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isEditing ? "Edit your message..." : "Type a message..."
              }
              rows={1}
              style={{
                minHeight: "44px",
                height: "auto",
              }}
              autoFocus={true}
            />
          </div>

          {isEditing && (
            <button
              onClick={handleCancelEdit}
              className="p-3 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300 transition-all duration-200 mb-1"
            >
              <X size={18} />
            </button>
          )}

          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className={`p-3 rounded-full transition-all duration-200 mb-1 ${
              text.trim()
                ? `${
                    isEditing
                      ? "bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700"
                      : "bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700"
                  } text-white shadow-lg`
                : "bg-gray-200 dark:bg-gray-400 text-gray-400 dark:text-gray-600 cursor-not-allowed"
            }`}
          >
            {isEditing ? <Check size={18} /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};
