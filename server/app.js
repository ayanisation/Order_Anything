const express = require("express");
const cors = require("cors");
const http = require("http");
const home = require("./Routes/home.js");
const items = require("./Routes/items.js");
const orders = require("./Routes/orders.js");
const users = require("./Routes/users.js");
require("./Database/connect.js");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", home);
app.use("/items", items);
app.use("/orders", orders);
app.use("/users", users);

const io = require("socket.io")(server, { cors: { origin: "*" } });
io.on("connection", (socket) => {
  socket.on("update", () => {
    socket.broadcast.emit("update");
  });
});

server.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});
