import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

interface ChatBoxProps {
  otherUserId: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ otherUserId }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = user?.id;

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUserId) return;
      try {
        const token = await getToken();
        const response = await axios.get(`/api/messages/${otherUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };
    fetchMessages();
  }, [otherUserId, currentUserId, getToken]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUserId) return;
    try {
      const token = await getToken();
      const response = await axios.post(
        "/api/messages",
        {
          receiverId: otherUserId,
          content: newMessage.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages((prev) => [...prev, response.data.message]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, width: 300, height: 400, display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflowY: "auto", marginBottom: 10 }}>
        {messages.map((msg) => (
          <div
            key={msg._id}
            style={{
              textAlign: msg.senderId === currentUserId ? "right" : "left",
              margin: "5px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "5px 10px",
                borderRadius: 15,
                backgroundColor: msg.senderId === currentUserId ? "#007bff" : "#e5e5ea",
                color: msg.senderId === currentUserId ? "white" : "black",
                maxWidth: "80%",
                wordWrap: "break-word",
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
      />
      <button onClick={handleSendMessage} style={{ marginTop: 5, padding: "8px 12px", borderRadius: 4, backgroundColor: "#007bff", color: "white", border: "none" }}>
        Send
      </button>
    </div>
  );
};

export default ChatBox;
