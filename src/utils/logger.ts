import "winston-daily-rotate-file";

import DailyRotateFile from "winston-daily-rotate-file";

import { createLogger, format, transports, config } from "winston";

interface DailyRotateFileInterface {
  filename: string;
  level: string;
}

const transport = ({
  filename,
  level,
}: DailyRotateFileInterface): DailyRotateFile =>
  new DailyRotateFile({
    filename: `logs/LOGS_${filename}-%DATE%.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: level,
  });

const logger = createLogger({
  levels: config.syslog.levels,
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "file-storage-app" },
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),

    transport({ filename: "ERROR", level: "error" }),
    transport({ filename: "COMBINED", level: "info" }),
  ],
});

export default logger;
