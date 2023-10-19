const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { time, timeStamp } = require("console");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const comPath = "COM3"; // change this depending on the server's port that is connected to the board
const cookieParser = require('cookie-parser')
app.use(cookieParser());
let GRID_SIZE = 720;
let gridData = Array(GRID_SIZE).fill("#ffffff"); // fill the grid with all white, so it is easy to visualize what pixels have been filled

const lastEditedCollection = new Map();

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("a user connected, " + socket.id);
  socket.emit("setUpGraph", GRID_SIZE, gridData);

  socket.on("pixel-change", (data) => {
    const currentTimestamp = Date.now();
    // Update the gridData with the new color
    if (!lastEditedCollection.get(data.userID)) {
      lastEditedCollection.set(data.userID, currentTimestamp);
      gridData[data.index] = data.color;
      console.log(JSON.stringify(data.index) + "," + data.color);
      io.emit("update-pixel", data);
      return;
    } else if (currentTimestamp - lastEditedCollection.get(data.userID) < 800) {
      console.log("Too short from last edit");
      return;
    } else {
      lastEditedCollection.set(data.userID, currentTimestamp);
      gridData[data.index] = data.color;
      console.log(JSON.stringify(data.index) + "," + data.color);
      io.emit("update-pixel", data);
    }
  });

  /*
  if (currentTimestamp - lastEditedCollection.get(data.userID) >= 10000) { // 追加: 2分（2 * 60,000 ミリ秒）
    console.log("10秒経過: 全てのセルをリセット");
    io.emit("reset-all-cells", {
        index: 0,
        color: "#ffffff",
        userID: socket.id,
    });
    console.log("2分経過: 全てのセルをリセット");
  }
  */

  socket.on("reset-all-cells", (data) => {
    for (let i = 0; i < GRID_SIZE; i++) {
      gridData[i] = data.color;
      data.index = i;
      io.emit("update-pixel", data);
    }
    console.log("all cell reset");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
