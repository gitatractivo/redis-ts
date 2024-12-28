import * as net from "net";
import { handleCommand } from "./utils/handleCommand";


// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server: net.Server = net.createServer((socket: net.Socket) => {

  const store = new Map();
  console.log("Client connected:", socket.address(), "\n");

  socket.on("data", async (data:BinaryData) => {
    

    console.log("Received: ", JSON.stringify(data.toString()), "\n");
    
    const resp = await handleCommand(data.toString(),store);
    console.log("resp",resp,);
    
    socket.write(resp);

    
  });
  socket.on("end", () => {
    console.log("Client disconnected");
  });

});
server.listen(6379, "127.0.0.1");



