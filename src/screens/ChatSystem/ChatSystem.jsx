import React, { useState, useEffect, } from "react";
import { ref, push } from "firebase/database";
import { database, auth } from "../../services/firebaseConfig";
import HeaderAndSideBar from "../../components/ReusableComponents/HeaderSidebar";
import { Send} from "lucide-react";
import { useLocation } from "react-router-dom";
import {ChatList} from "./ChatList";
import {ChatWindow} from "./ChatWindow";

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


const ChatSystem = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const location = useLocation();
 
  // Get targetUser from location state if available
  const { targetUser } = location.state || {};

  useEffect(() => {
    if (targetUser) {
      setSelectedUser(targetUser);
    }
  }, [targetUser]);

  console.log("Selected User:", selectedUser);

  return (
    <HeaderAndSideBar
      content={
        <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-100">
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
                className={`flex-1 hidden lg:flex items-center justify-center bg-white dark:bg-gray-800`}
              >
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send
                      size={32}
                      className="text-gray-400 dark:text-gray-200"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-400 mb-2">
                    Your Messages
                  </h3>
                  <p className="text-gray-500 dark:text-gray-300 max-w-sm">
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
