import { useState } from "react";

export interface Log {
  type: string;
  log: string;
  date: Date;
}

export const useLogger = () => {
  const [logs, setLogs] = useState<Log[]>([]);

  const newLog = (newLog: { type: string; log: string }) => {
    const newLogWithDate: Log = { ...newLog, date: new Date() };
    setLogs((logs) => [...logs, newLogWithDate]);
  };

  return { logs, newLog };
};
