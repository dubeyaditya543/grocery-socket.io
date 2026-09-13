import { createServer } from "http";
import { Server, Socket } from "socket.io";

const PORT = process.env.SOCKET_PORT ? Number(process.env.SOCKET_PORT) : 3001;
const CLIENT_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket: Socket) => {
  console.log(`Client Connected: ${socket.id}`);

  socket.on("join-group", (groupId: string) => {
    socket.join(groupId);
    console.log(`Socket ${socket.id} joined group: ${groupId}`);
  });

  socket.on("leave-group", (groupId: string) => {
    socket.leave(groupId);
    console.log(`Socket ${socket.id} left group: ${groupId}`);
  });

  socket.on("group:update", (groupId: string) => {
    socket.to(groupId).emit("group:updated");
    console.log(`Broadcasted group:updated to room: ${groupId}`)
  })

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`)
  })

});

httpServer.listen(PORT, () => {
  console.log(`Socket.io server running on http://localhost:${PORT}`)
})

