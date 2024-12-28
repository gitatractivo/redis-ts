import { Commands } from "./commands";
import { AllowedType } from "./handleCommand";

const CRLF = '\r\n';
const BULK_STRING = '$';

export const deserializeCommand = (data: any) => {
  const inputArr = data.split(CRLF);
  //validate command
  validateCommand(data, inputArr);

  //parse command
  // console.log("inputArr:",JSON.stringify(inputArr));

  deserializeArray(data);

  //return command

  return [];
};

const validateCommand = (input: string,inputsArr:string[]) :void | Error=> {
  //validate command with respect to redis serialisation and redis commands
  // console.log("inputsArr:",JSON.stringify(inputsArr));
  if (!inputsArr[0].startsWith("*") || !inputsArr[1].startsWith("$")) {
    throw new Error(
      `Invalid command: command should be an array of bulk strings.`
    );
  }

  if (!input.endsWith(CRLF)) {
    throw new Error(`Invalid command: ${CRLF} missing at the end of command.`);
  }
  const command = inputsArr[2].toUpperCase();
  console.log("command",command);
  //check if command is there inside of enum
  // TODO: check if command is there inside of enum

  if (!(command in Commands)) {
    throw new Error(`Invalid command: ${inputsArr[2]} not a valid command.`);
  }

  //return true if valid
  
}

export const deserializeBulk = (data: any) => {};



export const deserialize:AllowedType = (input :string)=>{
  switch(input[0]){
    
			case "-":
				return deserializeError(input);

			case "+":
				return deserializeSimpleString(input);

			case "$":
				return deserializeBulkString(input);

			// case ":":
			// 	return deserializeInteger();

			// case "(":
			// 	return deserializeBigInteger();

			// case ",":
			// 	return deserializeDoubles();

			// case "#":
			// 	return deserializeBoolean();

			case "*":
				return deserializeArray(input);

			case "%":
			// 	return deserializeMap();

			// case "~":
			// 	return deserializeSet();

			// case "_":
			// 	return deserializeNull();

			default:
				throw new Error("Invalid data type");
		
  }
  return "";
}
export const deserializeSimpleString = (input: string): string => {
  // Remove the '+' prefix and CRLF
  return input.slice(1, -2);
}



export const deserializeError = (input: string): Error => {
  // Remove the '-' prefix and CRLF
  const errorMessage = input.slice(1, -2);
  return new Error(errorMessage);
};

export const deserializeBulkString = (input: string): string | null => {
  const [lengthLine, ...rest] = input.split(CRLF);
  const length = parseInt(lengthLine.slice(1));

  // Handle null bulk string
  if (length === -1) return null;

  // Return the actual string content
  return rest[0];
};

export const deserializeArray = (input: string): any[] => {
  const lines = input.split(CRLF);
  const count = parseInt(lines[0].slice(1));

  if (count === -1) return [];

  const result = [];
  let currentIndex = 1;

  for (let i = 0; i < count; i++) {
    const item = lines[currentIndex];
    result.push(item)
    // result.push(deserialize(item));
  }
  console.log("result", result, lines, input, lines[0].slice(1));

  return result;
};