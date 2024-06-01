import { useEffect, useState } from "react";
import { toast } from "react-toastify";
// import ScrollToBottom from "react-scroll-to-bottom";
import { Socket } from "socket.io-client";
import { AiOutlineSend } from "react-icons/ai";
interface CharMesgProps {
  socket: Socket;
  username: string;
  room: string;
}

interface MessageData {
  room: string;
  auther: string;
  message: string;
  time: string;
}
const ChatMessage: React.FC<CharMesgProps> = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [messageList, setMessageList] = useState<MessageData[]>([]);

  const handleChatMessage = async () => {
    if (currentMessage !== "") {
      const messageData: MessageData = {
        room: room,
        auther: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
    } else {
      toast.error("Please enter a message to send");
    }

    setCurrentMessage("");
  };

  useEffect(() => {
    socket.on("receive_message", (data: MessageData) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleChatMessage();
    }
  };
  return (
    <div className="chat_container">
      <div className="chat_header">
        <h3>Chat Kro</h3>
        
      </div>
      <div className="chat_message">
        {messageList.map((mess, index) => (
          <div
            key={index}
            className={`message_item ${
              mess.auther === username ? "my_message" : "other_message"
            }`}
          >
            <div className="message_data">
              <p className="message_author">{mess.auther}</p>
              <p className="message_time">{mess.time}</p>
            </div>
            <p className="message_text">{mess.message}</p>
          </div>
        ))}
      </div>
      <div className="chat_footer">
        <input
          type="text"
          placeholder="Type your message..."
          onChange={(e) => setCurrentMessage(e.target.value)}
          value={currentMessage}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleChatMessage}>
          <AiOutlineSend />
        </button>
      </div>
    </div>
  );
};

export default ChatMessage;
