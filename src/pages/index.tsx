import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";

const Main: NextPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <AuthShowcase />
    </main>
  );
};

export default Main;

const AuthShowcase: React.FC = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();

  const getEnvAndNav = useCallback(async () => {
    if (process.env.NODE_ENV === "development") {
      await router.push("http://localhost:3000/home");
    } else {
      await router.push("https://coding-assignment-t3.vercel.app/home");
    }
  }, []);

  useEffect(() => {
    if (sessionData) {
      void getEnvAndNav();
    }
  }, [sessionData]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-darkPurple">
      <div className="flex h-2/5 w-1/3 flex-col justify-between rounded-xl bg-white px-2 py-10 uppercase shadow-2xl">
        <div className="flex flex-col">
          <div className="mb-10 flex w-full items-center justify-center px-2 text-center text-lg font-semibold text-lightPurple lg:text-3xl">
            Coding Assignment by Eylon
          </div>
          <div className="mx-auto text-center font-semibold text-lightPurple">
            A fullstack todolist application
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            className="mx-auto mt-auto w-[80%] rounded-lg bg-lightPurple text-center text-sm font-semibold uppercase text-white no-underline transition hover:bg-lightPurple/80 md:px-10 md:py-3 lg:text-lg"
            onClick={() => {
              void signIn("google", {
                callbackUrl: "/home",
              });
            }}
          >
            Login using google
          </button>
          {/* <button
            className="mx-auto mt-auto w-[80%] rounded-full bg-lightPurple px-10 py-3 text-lg font-semibold uppercase text-white no-underline transition hover:bg-lightPurple/80"
            onClick={() => {
              void signIn("discord", {
                callbackUrl: "/home",
              });
            }}
          >
            Login using discord
          </button> */}
        </div>
      </div>
    </div>
  );
};
