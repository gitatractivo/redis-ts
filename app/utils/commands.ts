// this is enum has all the commands of redis that are supported by the server

export enum Commands {
  PING = "PING",
  ECHO = "ECHO",
  SET = "SET",
  GET = "GET",
  INCR = "INCR",
  DECR = "DECR",
  DEL = "DEL",
  EXISTS = "EXISTS",
  KEYS = "KEYS",
  FLUSHALL = "FLUSHALL",
  FLUSHDB = "FLUSHDB",
  EXPIRE = "EXPIRE",
  TTL = "TTL",
  RPUSH = "RPUSH",
  LPUSH = "LPUSH",
  LLEN = "LLEN",
  LRANGE = "LRANGE",
  LPOP = "LPOP",
  RPOP = "RPOP",
  SADD = "SADD",
  SMEMBERS = "SMEMBERS",
  SREM = "SREM",
  SCARD = "SCARD",
  SINTER = "SINTER",
  SUNION = "SUNION",
  SDIFF = "SDIFF",
  SAVE = "SAVE",
  RESTORE = "RESTORE",
  BGSAVE = "BGSAVE",
  COMMAND="COMMAND",
  INFO="INFO",
  


}
