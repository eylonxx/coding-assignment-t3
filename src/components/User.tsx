import { signOut } from "next-auth/react";
import Image from "next/image";
import React from "react";
interface UserProps {
  image: string;
  name: string | null | undefined;
}
const User = ({ image, name }: UserProps) => {
  return (
    <div className="mb-2 flex flex-col items-center gap-2 lg:flex-row">
      <button
        className="min-w-[40px] self-start"
        onClick={() => void signOut({ callbackUrl: "/" })}
      >
        {image ? (
          <Image
            src={image}
            width={40}
            height={40}
            className="rounded-full"
            alt="me"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-slate-400 opacity-40" />
        )}
      </button>
      <div className="flex w-full flex-col justify-start">
        <div className="text-xl xl:text-2xl">Welcome,</div>
        <div className="text-lg text-lightPurple md:text-2xl">{name}</div>
      </div>
    </div>
  );
};

export default User;
