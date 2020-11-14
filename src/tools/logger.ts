import winston from "winston";
import { __winston_log_level__ } from "../constants";

export const setupWinston = (): winston.Logger => {
  const transports = [];
  if (process.env.NODE_ENV !== "development") {
    transports.push(new winston.transports.Console());
  } else {
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.cli(),
          winston.format.splat()
        ),
      })
    );
  }

  const instance = winston.createLogger({
    level: __winston_log_level__,
    levels: winston.config.npm.levels,
    format: winston.format.combine(
      winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json()
    ),
    transports,
  });

  return instance;
};

export const logger = setupWinston();
