import { Commands } from "./commands";
import { deserializeCommand } from "./deserialize";

export type AllowedType =
  | string
  | number
  | boolean
  | null
  | Map<AllowedType, AllowedType>
  | Set<AllowedType>
  | Array<AllowedType>
  | IterableIterator<AllowedType>
  | Error;

export  const handleCommand = async (data: string): Promise<string> => {
  console.log("inside:handleCommand",JSON.stringify(data));
  let response: AllowedType ="" ;
  let errorPrefix: string | null ;
  const [command, args] = deserializeCommand(data);
  try {
    switch (command) {
      case Commands.PING:
        console.log("inside:PING");

        break;
      case Commands.ECHO:
        console.log("inside:ECHO");
        break;
      case Commands.COMMAND:
        response = "+OK\r\n";
        break;
      default:
        console.log("inside:default");
        response = "-ERR unknown command:"+command+"\r\n";
        return response;
    }
  } catch (error:any) {
    console.log("inside:catch");
    response = error.message;
    errorPrefix = "ERR";
  }
  


  return "";
};
