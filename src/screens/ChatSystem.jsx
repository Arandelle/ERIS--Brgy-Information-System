import React, { useState, useEffect, useRef } from 'react';
import { Send, User, MessageCircle } from 'lucide-react';
import { ref, onValue,push } from "firebase/database";
import { database, auth } from '../services/firebaseConfig';

const ChatList = ({ onSelect }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const chatRef = ref(database, `chats/${user.uid}`);
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val() || {};
      setChats(Object.keys(data));
    });
  }, []);

  return (
    <div className="w-64 border-r p-4">
      <h2 className="font-bold text-xl mb-4">Conversations</h2>
      {chats.map((uid) => (
        <div key={uid} className="p-2 cursor-pointer hover:bg-gray-100" onClick={() => onSelect(uid)}>
          Chat with {uid}
        </div>
      ))}
    </div>
  );
}

// src/components/MessageBubble.js
 const MessageBubble = ({ text, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
      <div className={`p-3 rounded-lg max-w-xs ${isOwn ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
        {text}
      </div>
    </div>
  );
}


const ChatWindow = ({ selectedResponderUID}) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const user = auth.currentUser;

  useEffect(() => {
    if (!user || !selectedResponderUID) return;

    const chatRef = ref(database, `chats/${user.uid}/${selectedResponderUID}`);
    return onValue(chatRef, (snapshot) => {
      const data = snapshot.val() || {};
      const sorted = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
      setMessages(sorted);
    });
  }, [selectedResponderUID]);

  const handleSend = async () => {
    if (!text.trim()) return;
    const chatRef = ref(database, `chats/${user.uid}/${selectedResponderUID}`);
    await push(chatRef, {
      sender: user.uid,
      text,
      timestamp: Date.now()
    });

    const mirroredRef = ref(database, `chats/${selectedResponderUID}/${user.uid}`);
    await push(mirroredRef, {
      sender: user.uid,
      text,
      timestamp: Date.now()
    });

    setText("");
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} text={msg.text} isOwn={msg.sender === user.uid} />
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
        />
        <button className="bg-blue-500 text-white px-4 rounded" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}



const ChatSystem = () => {
 const [selectedResponder, setSelectedResponder] = useState(null);

  return (
    <div className="flex h-screen">
      <ChatList onSelect={setSelectedResponder} />
      {selectedResponder ? (
        <div className="flex-1">
          <ChatWindow selectedResponderUID={selectedResponder} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
        <button onClick={() => setSelectedResponder("HrXn023K8nbeQs7GpEhsnZw5DZT2")}>HrXn023K8nbeQs7GpEhsnZw5DZT2</button>
          Select a conversation
        </div>
      )}
    </div>
  );
};

export default ChatSystem;