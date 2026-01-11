const { Server } = require("socket.io");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    // ✅ join group room
    socket.on("join_group", (groupId) => {
      socket.join(groupId.toString());
      console.log(`📌 Socket ${socket.id} joined group ${groupId}`);
    });

    // ✅ join user room (GLOBAL notifications)
    socket.on("join_user", (userId) => {
      socket.join(userId.toString());
      console.log(`👤 Socket ${socket.id} joined user ${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });

  return io;
}

function getIO() {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
}

module.exports = { initSocket, getIO };
