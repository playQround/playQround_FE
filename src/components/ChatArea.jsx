import io from "socket.io-client";

const ChatArea = () => {
    const socket = io.connect(process.env.REACT_APP_SERVER_URL);
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
