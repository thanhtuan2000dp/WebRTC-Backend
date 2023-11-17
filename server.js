const express = require("express");
const http = require("http");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const twilio = require("twilio");

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

app.use(cors());

let connectedUsers = [];
let rooms = [];

app.get("/api/room-exists/:roomId", (req, res) => {
    const { roomId } = req.params;
    const room = rooms.find((room) => room.id === roomId);

    if (room) {
        if (room.connectedUsers.length > 3) {
            res.send({ existRoom: true, fullUsers: true }).status(200);
        } else {
            res.send({ existRoom: true, fullUsers: false }).status(200);
        }
    } else {
        res.send({ existRoom: false }).status(404);
    }
});

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});
