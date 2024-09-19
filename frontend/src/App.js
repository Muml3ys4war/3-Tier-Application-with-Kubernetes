import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [groupID, setGroupID] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Function to fetch messages for the specified group
  const fetchMessages = async () => {
    if (groupID) {
      try {
        const response = await axios.get(
          `http://localhost:5000/messages/${groupID}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }
  };

  // Function to handle sending a new message
  const sendMessage = async (event) => {
    event.preventDefault();
    if (!groupID || !username || !message) return;

    try {
      await axios.post("http://localhost:5000/send-message", {
        groupID,
        username,
        message,
      });

      // Clear the message input field
      setMessage("");

      // Fetch updated messages
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Fetch messages whenever groupID changes
  useEffect(() => {
    fetchMessages();
  }, [groupID]);

  return (
    <div className="chat-container">
      <h2>Chat Application</h2>

      <div className="message-form">
        <input
          type="text"
          placeholder="Group ID"
          value={groupID}
          onChange={(e) => setGroupID(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div className="messages">
        {messages.map((msg) => (
          <div key={msg._id} className="message">
            <strong>{msg.username}</strong>: {msg.message} <br />
            <small>{new Date(msg.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
