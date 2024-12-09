const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" },
});
let userlist = []

io.on("connection", (socket) => {
  // console.log(socket.id);
  socket.emit("userList", {userid:socket.id , userList:userlist})
  userlist.push(socket.id)

  socket.on("reqwest", (reqwest) => {
    console.log("reqwest send", reqwest.name);
    io.to(reqwest.userId).emit("reqwest", reqwest);
  });

  socket.on("offercall", (reqwest) => {
    console.log(reqwest);
    io.to(reqwest).emit("offercall",reqwest);
  });

  socket.on("offer", (offer) => {
    // console.log("Offer received", offer.offer);
    io.to(offer.userId).emit("offer", offer.offer);
  });

  socket.on("answer", (answer) => {
    // console.log("Answer received",);
    answer.userId = socket.id
    socket.broadcast.emit("answer", answer);
  });

  socket.on("ice-candidate", (candidate) => {
    // console.log("ICE Candidate received",candidate );
    socket.broadcast.emit("ice-candidate", candidate);
  });

  socket.on("disconnect", () => {
    userlist.pop()
    // console.log("User disconnected");
  });
  
});
function error(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
}
app.use(error);
server.listen(9000, () => {
  console.log("Server is running on Port 3000");
});