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




const handleListen = () => console.log('Listening on http://localhost:3000');
httpServer.listen(3000, handleListen);


