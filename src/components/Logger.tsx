import React from "react";
import type { Log } from "~/hooks/useLogger";

interface LoggerProps {
  logs: Log[];
}
const Logger = ({ logs }: LoggerProps) => {
  return (
    <>
      <div className="font-bold uppercase tracking-wider text-white">
        Logger
      </div>
      <div className="logger-scrollbar mx-auto flex h-[80%] w-full flex-col items-center gap-1 overflow-y-scroll">
        {logs.map((log, i) => (
          <div
            key={i}
            className="mx-auto flex min-h-[30px] w-11/12 items-center gap-2 rounded-lg border-4  bg-white text-xs font-bold uppercase text-darkPurple"
          >
            <p>{log.date.toLocaleTimeString()}</p>
            <p className="">{log.type}</p>
            <p className="truncate text-xs uppercase">{log.log}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Logger;
