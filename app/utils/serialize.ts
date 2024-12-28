const CRLF = "\r\n";

export const serialize = (data: any): string => {
  if (data === null || data === undefined) return serializeNull();
  if (typeof data === "string") return serializeBulkString(data);
  if (typeof data === "number") {
    return Number.isInteger(data)
      ? serializeInteger(data)
      : serializeDouble(data);
  }
  if (typeof data === "boolean") return serializeBoolean(data);
  if (typeof data === "bigint") return serializeBigInteger(data);
  if (data instanceof Error) return serializeError(data);
  if (Array.isArray(data)) return serializeArray(data);
  if (data instanceof Map) return serializeMap(data);
  if (data instanceof Set) return serializeSet(data);
  if (typeof data === "object") {
    return serializeMap(new Map(Object.entries(data)));
  }
  throw new Error(`Unsupported data type: ${typeof data}`);
};

export const serializeSimpleString = (str: string): string => `+${str}${CRLF}`;

export const serializeError = (error: Error): string =>
  `-${error.message}${CRLF}`;

export const serializeBulkString = (str: string): string => {
  if (str === null) return `$-1${CRLF}`;
  console.log("str",str);
  return `$${str.length}${CRLF}${str}${CRLF}`;
};

export const serializeInteger = (num: number): string => `:${num}${CRLF}`;

export const serializeBigInteger = (num: bigint): string => `(${num}${CRLF}`;

export const serializeDouble = (num: number): string =>
  `,${num.toString()}${CRLF}`;

export const serializeBoolean = (bool: boolean): string =>
  `#${bool ? "t" : "f"}${CRLF}`;

export const serializeNull = (): string => `_${CRLF}`;

export const serializeArray = (arr: any[]): string => {
  if (arr === null) return `*-1${CRLF}`;
  const elements = arr.map((item) => serialize(item)).join("");
  return `*${arr.length}${CRLF}${elements}`;
};

export const serializeMap = (map: Map<any, any>): string => {
  if (map === null) return `%-1${CRLF}`;
  const elements = Array.from(map.entries())
    .map(([key, value]) => serialize(key) + serialize(value))
    .join("");
  return `%${map.size}${CRLF}${elements}`;
};

export const serializeSet = (set: Set<any>): string => {
  if (set === null) return `~-1${CRLF}`;
  const elements = Array.from(set)
    .map((item) => serialize(item))
    .join("");
  return `~${set.size}${CRLF}${elements}`;
};
