"use client";
import { signIn } from "next-auth/react";
import React from "react";

const Landing = () => {
  return (
    <div className="flex min-h-screen grow flex-col items-center justify-center gap-5">
      <div>Login using Discord</div>
      <div
        className="flex h-20 w-40 cursor-pointer items-center justify-center rounded-md bg-gray-900 text-5xl"
        onClick={() => void signIn()}
      >
        Login
      </div>
    </div>
  );
};

export default Landing;
