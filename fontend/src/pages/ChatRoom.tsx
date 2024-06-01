import { useState } from "react";
import ChatMessage from "./ChatMessage";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

const socket = io("http://localhost:8000");

const ChatRoom = () => {
  const [username, setUserName] = useState<string>("");
  const [room, setRoomID] = useState<string>("");
  const [showChat, setShowChat] = useState(false);

  const handleRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      toast.success("Joined room");
      setShowChat(true);
    } else {
      toast.error("Please enter a username and a room");
    }
  };
  return (
    <div className="room_container">
      {!showChat ? (
        <>
          <div>
            <label>Your Name</label>
            <input
              type="text"
              onChange={(e) => setUserName(e.target.value)}
              value={username}
            />
          </div>
          <div>
            <label>Enter Room Id</label>
            <input
              type="text"
              onChange={(e) => setRoomID(e.target.value)}
              value={room}
            />
          </div>
          <button onClick={handleRoom}>Send</button>
        </>
      ) : (
        <ChatMessage socket={socket} username={username} room={room} />
      )}
    </div>
  );
};

export default ChatRoom;
