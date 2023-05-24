import { signOut } from "next-auth/react";
import Image from "next/image";
import React from "react";
interface UserProps {
  image: string;
  name: string | null | undefined;
}
const User = ({ image, name }: UserProps) => {
  return (
    <div className="mb-2 flex items-center gap-2">
      <button onClick={() => void signOut({ callbackUrl: "/" })}>
        {image && (
          <Image
            src={image}
            width={40}
            height={40}
            className="rounded-full"
            alt="me"
          />
        )}
      </button>
      <div className="flex flex-col">
        <div className="text-xl">Welcome,</div>
        <div className="text-lg text-lightPurple md:text-xl">{name}</div>
      </div>
    </div>
  );
};

export default User;
