import React, { useState, useEffect } from "react";
import { ref, onValue, push, get } from "firebase/database";
import { database, auth } from "../services/firebaseConfig";
import HeaderAndSideBar from "../components/ReusableComponents/HeaderSidebar";

const MessageBubble = ({ text, isOwn }) => (
  <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
    <div
      className={`p-3 rounded-lg max-w-xs ${
        isOwn ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
      }`}
    >
      {text}
    </div>
  </div>
);

// 🔍 User Search & List Component
const ChatList = ({ onSelect }) => {
  const [search, setSearch] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const userSnap = await get(ref(database, "users"));
      const responderSnap = await get(ref(database, "responders"));
      const users = userSnap.exists() ? Object.entries(userSnap.val()) : [];
      const responders = responderSnap.exists()
        ? Object.entries(responderSnap.val())
        : [];

      const combined = [...users, ...responders].map(([uid, data]) => ({
        uid,
        name: data.fullname || data.customId || uid,
      }));

      setAllUsers(combined);
      setFilteredUsers(combined);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const result = allUsers.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(result);
  }, [search, allUsers]);

  return (
    <div className="max-w-2xl border-r p-4 bg-white shadow">
      <h2 className="font-bold text-xl mb-4">Conversatios</h2>
      <input
        type="text"
        placeholder="Search users..."
        className="w-full p-2 border rounded mb-3 bg-gray-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="overflow-y-auto max-h-[70vh]">
        {filteredUsers.map(({ uid, name }) => (
          <div
            key={uid}
            className="p-2 cursor-pointer hover:bg-gray-100 rounded"
            onClick={() => onSelect({ uid, name })}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
};

// 💬 Chat Window
const ChatWindow = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const user = auth.currentUser;

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
  }, [selectedUser]);

  const handleSend = async () => {
    if (!text.trim() || !user) return;

    const message = {
      sender: user.uid,
      text,
      timestamp: Date.now(),
    };

    const userRef = ref(database, `chats/${user.uid}/${selectedUser.uid}`);
    const mirroredRef = ref(database, `chats/${selectedUser.uid}/${user.uid}`);

    await push(userRef, message);
    await push(mirroredRef, message);
    setText("");
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="font-bold text-lg mb-2 border-b pb-2">
        Chat with {selectedUser.name}
      </div>
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg, idx) => (
          <MessageBubble
            key={idx}
            text={msg.text}
            isOwn={msg.sender === user?.uid}
          />
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
        />
        <button
          className="bg-blue-500 text-white px-4 rounded"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

// 🧩 Parent Chat System
const ChatSystem = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <HeaderAndSideBar
      content={
        <div className="flex bg-gray-50">
          <ChatList onSelect={setSelectedUser} />
          {selectedUser ? (
            <div className="flex-1">
              <ChatWindow selectedUser={selectedUser} />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      }
    />
  );
};

export default ChatSystem;
