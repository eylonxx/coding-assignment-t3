import Link from "next/link";
import React from "react";

const ErrorPage = () => {
  return (
    <div className="box-border flex h-screen w-screen flex-col items-center justify-center gap-6  bg-darkPurple">
      <p className="text-center text-4xl text-white">Something went wrong...</p>
      <Link
        href="/"
        className=" box-border flex min-w-[70px] items-center justify-center rounded-xl border-4 border-white bg-lightPurple p-2  text-sm font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-white hover:text-lightPurple"
      >
        Try Again
      </Link>
    </div>
  );
};

export default ErrorPage;
