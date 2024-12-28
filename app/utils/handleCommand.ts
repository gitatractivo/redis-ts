import { Commands } from "./commands";
import { deserializeCommand } from "./deserialize";
import { RedisDeserializer } from "./RedisDeserializer";
import { serializeBulkString, serializeNull, serializeSimpleString } from "./serialize";

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

export  const handleCommand = async (data: string,store:Map<any,any>): Promise<string> => {
  
  let response: AllowedType ="" ;
  let errorPrefix: string | null ;
  const deserializer = new RedisDeserializer(data.toString());
  const resp = deserializer.deserializeCommand();
  const [command, ...args] = resp;
  console.log("command",command,args);
  try {
    switch (command.toUpperCase()) {
      case Commands.PING:
        console.log("inside:PING");
        response = serializeSimpleString("PONG");
        break;
      case Commands.ECHO:
        console.log("inside:ECHO",args,args.join(" "));

        response=serializeBulkString(args.join(" "));
        break;
      case Commands.COMMAND:
        console.log("inside:COMMAND");
        response =serializeSimpleString("OK");
        break;

      case Commands.SET:
        console.log("inside:SET");
        store.set(args[0],args[1]);
        response =serializeSimpleString("OK");
        break;
      case Commands.GET:
        console.log("inside:GET");
        const val = store.get(args[0]);
        
        response =serializeBulkString(val);
        //handle when key is not present
        if(val === undefined){
          response = serializeNull();
        }
        break;
      default:
        console.log("inside:default");
        response = "-ERR unknown command:"+command+"\r\n";
      }
      return response;
  } catch (error:any) {
    console.log("inside:catch");
    response = error.message;
    errorPrefix = "ERR";
  }
  console.log(":response",response);


  return "";
};
