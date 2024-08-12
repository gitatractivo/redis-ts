import * as net from "net";
enum Commands {
  PING ="PING"

}

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server: net.Server = net.createServer((connection: net.Socket) => {
  connection.on("data", (data) => {
    const dataString = data.toString()
    console.log(dataString)
    const command = dataString.split(" ")[0].trim();
    console.log(command, Commands.PING, Commands.PING===command);
    switch(command){
      case "PING":
        console.log("inside:PING")
        connection.write("+PONG\r\n")
        break;
      default:
        console.log("inside:default");

        connection.write("-ERR unknown command '" + command + "'\r\n")
    }
  });


  // connection.on("connectionAttempt")
});
server.listen(6379, "127.0.0.1");
