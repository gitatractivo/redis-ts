import { Commands } from "./commands";

export class RedisDeserializer {
  private input: string;
  private position: number;
  private readonly CRLF = "\r\n";

  constructor(input: string) {
    this.input = input;
    this.position = 0;
  }

  public deserialize(): any {
    console.log("inside:deserialize",this.input);
    const type = this.input[this.position];
    switch (type) {
      case "-":
        return this.deserializeError();
      case "+":
        return this.deserializeSimpleString();
      case "$":
        return this.deserializeBulkString();
      case ":":
        return this.deserializeInteger();
      case "(":
        return this.deserializeBigInteger();
      case ",":
        return this.deserializeDouble();
      case "#":
        return this.deserializeBoolean();
      case "*":
        return this.deserializeArray();
      case "%":
        return this.deserializeMap();
      case "~":
        return this.deserializeSet();
      case "_":
        return this.deserializeNull();
      default:
        throw new Error(`Invalid type identifier: ${type}`);
    }
  }

  private readLine(): string {
    const end = this.input.indexOf(this.CRLF, this.position);
    if (end === -1) {
      throw new Error("Malformed input: CRLF not found");
    }
    const line = this.input.slice(this.position, end);
    this.position = end + 2; // Skip CRLF
    return line;
  }

  private deserializeError(): Error {
    const line = this.readLine();
    return new Error(line.slice(1)); // Remove the '-' prefix
  }

  private deserializeSimpleString(): string {
    const line = this.readLine();
    return line.slice(1); // Remove the '+' prefix
  }

  private deserializeBulkString(): string | null {
    const lengthLine = this.readLine();
    const length = parseInt(lengthLine.slice(1)); // Remove the '$' prefix

    if (length === -1) {
      return null;
    }

    const content = this.input.slice(this.position, this.position + length);
    this.position += length + 2; // Skip content and CRLF
    return content;
  }

  private deserializeInteger(): number {
    const line = this.readLine();
    return parseInt(line.slice(1)); // Remove the ':' prefix
  }

  private deserializeBigInteger(): bigint {
    const line = this.readLine();
    return BigInt(line.slice(1)); // Remove the '(' prefix
  }

  private deserializeDouble(): number {
    const line = this.readLine();
    return parseFloat(line.slice(1)); // Remove the ',' prefix
  }

  private deserializeBoolean(): boolean {
    const line = this.readLine();
    const value = line.slice(1); // Remove the '#' prefix
    return value === "t";
  }

  private deserializeArray(): any[] {
    const lengthLine = this.readLine();
    const length = parseInt(lengthLine.slice(1)); // Remove the '*' prefix
    if (length === -1) {
      return [];
    }

    const result = [];
    for (let i = 0; i < length; i++) {
      const item = this.deserialize();
      result.push(item);
      console.log("result",item,this.input);
    }
    return result;
  }

  private deserializeMap(): Map<any, any> {
    const lengthLine = this.readLine();
    const length = parseInt(lengthLine.slice(1)); // Remove the '%' prefix

    if (length === -1) {
      return new Map();
    }

    const map = new Map();
    for (let i = 0; i < length; i++) {
      const key = this.deserialize();
      const value = this.deserialize();
      map.set(key, value);
    }
    return map;
  }

  private deserializeSet(): Set<any> {
    const lengthLine = this.readLine();
    const length = parseInt(lengthLine.slice(1)); // Remove the '~' prefix

    if (length === -1) {
      return new Set();
    }

    const set = new Set();
    for (let i = 0; i < length; i++) {
      set.add(this.deserialize());
    }
    return set;
  }

  private deserializeNull(): null {
    this.readLine(); // Consume the line
    return null;
  }

  // Helper method to deserialize a command
  public deserializeCommand(): string[] {
    const array = this.deserializeArray();
    if (!Array.isArray(array)) {
      throw new Error("Invalid command: not an array");
    }

    const command = array[0]?.toString().toUpperCase();
    if (!(command in Commands)) {
      throw new Error(`Invalid command: ${command} not a valid command`);
    }

    return array.map((item) => item.toString());
  }
}
