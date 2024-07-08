"use client";
import styles from "./styles.module.css";
import clsx from "clsx";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Signin() {
  const params = useSearchParams();
  const callbackUrl = params?.get("callbackUrl") || "/";

  // Toast control
  const [open, setOpen] = useState(false);
  const eventDateRef = useRef(new Date());
  const timerRef = useRef(0);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      window.location.href = callbackUrl;
    }
  }, [session, callbackUrl]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (!result?.ok) {
      // Open toast
      setOpen(false);
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        eventDateRef.current = new Date();
        setOpen(true);
      }, 100);
    }
  };
  return (
    <>
      <Toast.Provider swipeDirection="right">
        <Toast.Root className="ToastRoot" open={open} onOpenChange={setOpen}>
          <Toast.Title className="ToastTitle" style={{ color: "#ff0000" }}>
            Login failed! Please check username and password.
          </Toast.Title>
          <Toast.Description asChild>
            <time className="ToastDescription" dateTime={eventDateRef.current.toISOString()}>
              {prettyDate(eventDateRef.current)}
            </time>
          </Toast.Description>
        </Toast.Root>
        <Toast.Viewport className="ToastViewport" />
      </Toast.Provider>
      <div className="flex flex-1 justify-center px-2.5 pt-12">
        <div
          className={clsx(
            "flex min-h-full flex-1 flex-col justify-center px-6 py-12",
            styles.loginForm
          )}
        >
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-2.5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    id="email"
                    name="username"
                    type="email"
                    required
                    autoComplete="email"
                    className={clsx(
                      "block w-full rounded-md py-1.5 px-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
                      styles.inputStyle
                    )}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  {/* <div className="text-sm">
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Forgot password?
                    </a>
                  </div> */}
                </div>
                <div className="mt-2">
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className={clsx(
                      "block w-full rounded-md py-1.5 px-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
                      styles.inputStyle
                    )}
                  />
                </div>
              </div>

              <div>
                <button
                  type="button"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={onSubmit}
                >
                  Sign in
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
              Not a member?{" "}
              <Link
                href="/signup"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function SigninPage() {
  return (
    <Suspense>
      <Signin />
    </Suspense>
  );
}

function prettyDate(date: number | Date | undefined) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeStyle: "short" }).format(date);
}
