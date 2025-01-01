import http from "http";
import express from "express";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/")); //CATCHALL URL


const httpServer = http.createServer(app);          //express
const wsServer = new Server(httpServer);

wsServer.on("connection", backSocket => {           // 서버 연결
    backSocket.on("join_room", (roomName) => {        // {roomName}인 방에 입장
        backSocket.join(roomName); 
        backSocket.to(roomName).emit("welcome");
    })
    backSocket.on("offer", (offer, roomName) => {
        backSocket.to(roomName).emit("offer", offer);
    })
    backSocket.on("answer", (answer, roomName) => {
        backSocket.to(roomName).emit("answer", answer);
    })
})


const handleListen = () => console.log('Listening on http://localhost:3000');
httpServer.listen(3000, handleListen);


