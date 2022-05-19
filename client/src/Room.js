import React, { useState } from "react";
import Peer from "peerjs";
import jwtDecode from "jwt-decode";
import "./style.css";
import { Link } from "react-router-dom";
import Participants from "./Participants";
import Rating from "./Rating";
import { Button, TextField } from "@mui/material";
import { Redirect } from "react-router-dom";

export default function Room(props) {
  const { match, socket } = props;
  const roomId = match.params.id;
  const { token } = props;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);

  const sendMessage = (e) => {
    e.preventDefault();
    setMessage("");

    if (socket) {
      socket.emit("chat-message", {
        roomId,
        message,
      });
    }
  };

  let peer = null;

  React.useEffect(() => {
    if (token) {
      setUser(jwtDecode(token));
    }

    if (socket) {
      socket.emit("join-room", {
        roomId,
      });
    }

    return () => {
      if (socket) {
        socket.emit("leave-room", {
          roomId,
        });
      }
    };
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    if (socket) {
      socket.on("new-message", ({ message, hateSpeech, userId, name }) => {
        const newMessages = [
          ...messages,
          { message, hateSpeech, userId, name },
        ];
        setMessages(newMessages);
      });
    }
    // eslint-disable-next-line
  }, [messages]);

  return (
    <div className="room">
      <div className="participants-rating">
        <div className="participants-container">
          <Participants socket={socket} />
        </div>

        <div className="ratings-container">
          <Rating socket={socket} roomId={roomId} />
        </div>
      </div>

      <div className="messages-container">
        <div className="messages">
          <h2 id="messages-heading">Messages</h2>
          <ul>
            {messages.map((message, index) => {
              if (message.hateSpeech) {
                if (message.userId == user.id) {
                  return (
                    <li key={index} className="sent hatespeech">
                      <p className="message-user">{message.name}</p>
                      <p className="hatespeech-text">
                        {
                          "🚫 This message has been deleted because it comes under hate speech."
                        }
                      </p>
                    </li>
                  );
                }
                return (
                  <li key={index} className="received hatespeech">
                    <p className="message-user">{message.name}</p>
                    <p className="hatespeech-text">
                      {
                        "🚫 This message has been deleted because it comes under hate speech."
                      }
                    </p>
                  </li>
                );
              }

              if (message.userId == user.id) {
                return (
                  <li key={index} className="sent">
                    <p className="message-user">{message.name}</p>
                    <p>{message.message}</p>
                  </li>
                );
              }
              return (
                <li key={index} className="received">
                  <p className="message-user">{message.name}</p>
                  <p>{message.message}</p>
                </li>
              );
            })}
          </ul>
        </div>
        <form>
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            label="Type your message"
            id="fullWidth"
            size="small"
          />
          <input
            type="submit"
            className="send-message"
            value="Send"
            onClick={sendMessage}
          />
        </form>
      </div>
    </div>
  );
}
