// Fixed useUnreadMessages hook
import { useState, useEffect } from 'react';
import { ref, onValue, get, set } from 'firebase/database';
import { database, auth } from '../../services/firebaseConfig';
import { Tooltip } from "@mui/material";

export const useUnreadMessages = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    // Listen for new messages in all conversations
    const userChatsRef = ref(database, `chats/${currentUser.uid}`);
    
    const unsubscribe = onValue(userChatsRef, async (snapshot) => {
      if (!snapshot.exists()) {
        setUnreadCount(0);
        return;
      }

      const conversations = snapshot.val();
      let totalUnread = 0;

      // Get last read timestamps for each conversation
      const lastReadRef = ref(database, `lastRead/${currentUser.uid}`);
      const lastReadSnapshot = await get(lastReadRef);
      const lastReadData = lastReadSnapshot.exists() ? lastReadSnapshot.val() : {};

      // Count unread messages for each conversation
      for (const [otherUserId, messages] of Object.entries(conversations)) {
        const messageArray = Object.values(messages);
        const lastReadTimestamp = lastReadData[otherUserId] || 0;
        
        // Count messages from other user that are newer than last read
        const unreadInConversation = messageArray.filter(msg => 
          msg.sender !== currentUser.uid && 
          msg.timestamp > lastReadTimestamp
        ).length;
        
        totalUnread += unreadInConversation;
      }

      setUnreadCount(totalUnread);
    });

    return unsubscribe;
  }, [currentUser]);

  // Function to mark messages as read for a specific conversation
  const markAsRead = async (otherUserId) => {
    if (!currentUser) return;
    
    const lastReadRef = ref(database, `lastRead/${currentUser.uid}/${otherUserId}`);
    await set(lastReadRef, Date.now());
  };

  // Function to manually clear unread count (for button click)
  const clearUnreadCount = () => {
    setUnreadCount(0);
  };

  return { unreadCount, markAsRead, clearUnreadCount };
};

// Updated ChatButton component
export const ChatButton = ({ navigate, isOpen, icons }) => {
  const { unreadCount, clearUnreadCount } = useUnreadMessages();

  const handleChatClick = () => {
    navigate("/chats");
    // Note: Don't clear the count here - it should clear naturally when messages are read
  };

  return (
    <Tooltip
      title={<span className="text-sm">View Conversation</span>}
      placement="bottom"
      arrow
    >
      <button
        onClick={handleChatClick}
        type="button"
        className={`relative p-2 mr-1 ${
          isOpen ? "text-blue-600" : "text-gray-500"
        } rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600`}
      >
        <span className="sr-only">View Chat</span>
        <icons.message />
        
        {/* Unread message badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center min-w-[1.25rem] border-2 border-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
    </Tooltip>
  );
};