"use client";
import React, { useEffect, useRef, useState } from "react";
import * as Form from "@radix-ui/react-form";
import * as Toast from "@radix-ui/react-toast";
import JsGoogleTranslateFree from "@kreisler/js-google-translate-free";
import { Sentence, DataSub } from "@/components/Audio/type";
import styles from "./styles.module.css";
import clsx from "clsx";
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";

const GenerateTrans = () => {
  const axiosAuth = useAxiosAuth();
  // Toast control
  const [open, setOpen] = useState(false);
  const eventDateRef = useRef(new Date());
  const timerRef = useRef(0);
  const [isSuccess, setIsSuccess] = useState(true);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  // Form
  const [transData, setTransData] = useState("");
  const [audio, setAudio] = useState("");
  const [title, setTitle] = useState("");
  const [isSubmited, setIsSubmited] = useState(false);
  useEffect(() => {
    const getTrans = async () => {
      try {
        const kuroshiro = new Kuroshiro();
        await kuroshiro.init(
          new KuromojiAnalyzer({
            dictPath: "/dict/",
          })
        );
        const transObj: DataSub[] = JSON.parse(transData);
        const trans: Sentence[] = await Promise.all(
          transObj.map(async (item) => {
            const vn = await JsGoogleTranslateFree.translate({
              from: "ja",
              to: "vi",
              text: item.text,
            });
            const furigana = await kuroshiro.convert(item.text, {
              mode: "furigana",
              to: "hiragana",
            });

            let sentence: Sentence = {
              start: item.start,
              end: item.end,
              vn,
              furigana,
              transcripts: [
                {
                  start: item.start,
                  end: item.end,
                  text: item.text,
                },
              ],
            };
            return sentence;
          })
        );

        await axiosAuth.post("/listens/create", {
          title,
          audio,
          trans,
        });
        setIsSuccess(true);
        setAudio("");
        setTransData("");
      } catch (err) {
        setIsSuccess(false);
        setIsSubmited(false);
      }
      // Open toast
      setOpen(false);
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        eventDateRef.current = new Date();
        setOpen(true);
      }, 100);

      setIsSubmited(false);
    };
    if (isSubmited) {
      getTrans();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmited]);

  return (
    <>
      <Toast.Provider swipeDirection="right">
        <Toast.Root className="ToastRoot" open={open} onOpenChange={setOpen}>
          <Toast.Title
            className={clsx("ToastTitle", isSuccess ? styles.isToastSuccess : styles.isToastErr)}
          >
            {isSuccess ? "Transcript generated successfully!" : "Failed to generate transcript!"}
          </Toast.Title>
          <Toast.Description asChild>
            <time className="ToastDescription" dateTime={eventDateRef.current.toISOString()}>
              {prettyDate(eventDateRef.current)}
            </time>
          </Toast.Description>
        </Toast.Root>
        <Toast.Viewport className="ToastViewport" />
      </Toast.Provider>
      <div className={styles.formWrapper}>
        <Form.Root className={styles.FormRoot}>
          <Form.Field className={styles.FormField} name="title">
            <div
              style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}
            >
              <Form.Label className={styles.FormLabel}>Title</Form.Label>
            </div>
            <Form.Control asChild>
              <input
                className={styles.Input}
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Control>
          </Form.Field>
          <Form.Field className={styles.FormField} name="audio">
            <div
              style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}
            >
              <Form.Label className={styles.FormLabel}>Audio</Form.Label>
            </div>
            <Form.Control asChild>
              <input
                className={styles.Input}
                type="text"
                required
                value={audio}
                onChange={(e) => setAudio(e.target.value)}
              />
            </Form.Control>
          </Form.Field>
          <Form.Field className={styles.FormField} name="transcript">
            <div
              style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}
            >
              <Form.Label className={styles.FormLabel}>Transcript</Form.Label>
            </div>
            <Form.Control asChild>
              <textarea
                className={styles.Textarea}
                required
                value={transData}
                onChange={(e) => setTransData(e.target.value)}
              />
            </Form.Control>
          </Form.Field>
          <Form.Submit asChild>
            <button
              className={clsx(styles.Button, isSubmited && styles.disabled)}
              disabled={isSubmited}
              style={{ marginTop: 10 }}
              onClick={(e) => {
                e.preventDefault();
                setIsSubmited(true);
              }}
            >
              Generate Script
            </button>
          </Form.Submit>
        </Form.Root>
      </div>
    </>
  );
};

function prettyDate(date: number | Date | undefined) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeStyle: "short" }).format(date);
}

export default GenerateTrans;
