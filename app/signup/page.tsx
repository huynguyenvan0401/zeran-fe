"use client";
import Image from "next/image";
import styles from "./styles.module.css";
import clsx from "clsx";
import Link from "next/link";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";

export default function Signup({ params }: { params: { callbackUrl: string } }) {
  const router = useRouter();

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
      router.push("/");
    }
  }, [session, router]);

  const [registerCompleted, setRegisterCompleted] = useState(false);
  useEffect(() => {
    if (registerCompleted) {
      router.push("/signin");
    }
  }, [registerCompleted, router]);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const onSubmit = async () => {
    try {
      const result = await axios.post("/auth/register", {
        name,
        email: username,
        password,
      });
      setRegisterCompleted(true);
    } catch (err) {
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
            Something went wrong! Please try again later...
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
              Sign up
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                  Firstname
                </label>
                <div className="mt-2">
                  <input
                    onChange={(e) => setName(e.target.value)}
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className={clsx(
                      "block w-full rounded-md py-1.5 px-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
                      styles.inputStyle
                    )}
                  />
                </div>
              </div>
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
                  Sign up
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function prettyDate(date: number | Date | undefined) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeStyle: "short" }).format(date);
}
