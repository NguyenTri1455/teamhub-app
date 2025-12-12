import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import config from "./config";

let io: SocketIOServer;

export const initSocket = (httpServer: HttpServer) => {
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: "*", // Adjust for production
            methods: ["GET", "POST"]
        }
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error"));
        }
        try {
            const payload = jwt.verify(token, config.jwtSecret);
            (socket as any).userId = (payload as any).userId;
            next();
        } catch (err) {
            next(new Error("Authentication error"));
        }
    });

    io.on("connection", (socket: Socket) => {
        const userId = (socket as any).userId;
        console.log(`User connected: ${userId}, Socket: ${socket.id}`);

        // Join user to their own room for targeted events (e.g. force logout, direct updates)
        socket.join(`user_${userId}`);

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${userId}`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

// Typed events helpers
export const emitUserUpdate = (userId: number, data: any) => {
    if (!io) return;
    // Emit to everyone or just specific rooms?
    // Requirement 1 & 3: Realtime update info + avatar. 
    // Usually, other users need to see this update if they are viewing a list or chat.
    // Simplest: Emit to all authenticated clients "user_updated". Client decides if it cares.
    // Or if scalability matters, emit to relevant rooms. For this app, broadcast is fine or room "global".
    io.emit("user:updated", { userId, ...data });
};

export const emitForceLogout = (userId: number) => {
    if (!io) return;
    // Emit to the user's personal room
    io.to(`user_${userId}`).emit("auth:force_logout", { reason: "Password reset or Session revoked" });
};
