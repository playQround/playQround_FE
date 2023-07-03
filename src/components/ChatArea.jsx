import io from "socket.io-client";

const ChatArea = () => {
    const socket = io.connect("localhost:3000");
    const sendMessage = () => {
        socket.emit("message", { message: "hi" });
    };
    return (
        <>
            <button onClick={sendMessage}>message</button>
            <div>chat room here</div>
        </>
    );
};

export default ChatArea;
