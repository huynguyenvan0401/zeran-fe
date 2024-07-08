"use client";
import { useEffect, useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import { Sentence, Transcript } from "./data";
import clsx from "clsx";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { Subtile } from "@/app/listening/[id]/page";
import * as Switch from "@radix-ui/react-switch";
import H5AudioPlayer from "react-h5-audio-player";
import parse from "html-react-parser";
import styles from "./styles.module.css";
import "react-h5-audio-player/lib/styles.css";
import "./audio.css";

type Props = {
  subtitle: Subtile;
};

const CustomAudioPlayer = (props: Props) => {
  const { subtitle } = props;

  const [currentTime, setCurrentTime] = useState(0);
  const panelRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!panelRef) return;
    const panel = panelRef && panelRef.current;

    if (panel) {
      panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentTime]);

  const [isVnMode, setIsVnMode] = useState(false);
  const [isFuriganaMode, setIsFuriganaMode] = useState(false);

  const audioRef = useRef<H5AudioPlayer>(null);

  const handleClickTrans = (seekTime: number) => {
    const audioChildRef = audioRef?.current?.audio;
    if (audioChildRef && audioChildRef.current) {
      audioChildRef.current.currentTime = seekTime;
    }
  };

  return (
    <div className={styles.audioContainer}>
      <div className={styles.audioArea}>
        <AudioPlayer
          preload="metadata"
          src={subtitle.audio}
          listenInterval={10}
          onListen={(e) => {
            const target = e.currentTarget as HTMLVideoElement;
            setCurrentTime(target.currentTime);
          }}
          ref={audioRef}
        />
      </div>
      <div className={styles.setting}>
        <label className={styles.label} htmlFor="vn-mode" style={{ paddingRight: 15 }}>
          VN
        </label>
        <Switch.Root
          className={styles.switchRoot}
          id="vn-mode"
          checked={isVnMode}
          onCheckedChange={(checked) => setIsVnMode(checked)}
        >
          <Switch.Thumb className={styles.switchThumb} />
        </Switch.Root>

        <label className={styles.label} htmlFor="furigana-mode" style={{ marginLeft: "15px" }}>
          Furigana
        </label>
        <Switch.Root
          className={styles.switchRoot}
          id="furigana-mode"
          checked={isFuriganaMode}
          onCheckedChange={(checked) => setIsFuriganaMode(checked)}
        >
          <Switch.Thumb className={styles.switchThumb} />
        </Switch.Root>
      </div>
      <div>
        <ScrollArea.Root className={styles.scrollAreaRoot}>
          <ScrollArea.Viewport className={styles.scrollAreaViewport}>
            <ul className={styles.transArea}>
              {subtitle.trans.map((sentence: Sentence, sIndex) => {
                const isHighlightSentence =
                  sentence.start <= currentTime && currentTime <= sentence.end;
                return (
                  <li
                    key={`sentence-${sIndex}`}
                    className={clsx(
                      styles.sentence,
                      isHighlightSentence && styles.highlightSentence
                    )}
                    ref={isHighlightSentence ? panelRef : null}
                    onClick={() => handleClickTrans(sentence.start)}
                  >
                    {isVnMode ? (
                      <span className={styles.vnText}>{sentence.vn}</span>
                    ) : isFuriganaMode ? (
                      parse(sentence.furigana || "")
                    ) : (
                      <>
                        {sentence.transcripts.map((trans: Transcript, tIndex) => {
                          const isHighlightTrans =
                            trans.start <= currentTime && currentTime <= trans.end;
                          return (
                            <span
                              key={`trans-${tIndex}`}
                              className={clsx(isHighlightTrans && styles.highlightTrans)}
                            >
                              {trans.text}
                            </span>
                          );
                        })}
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar className={styles.scrollAreaScrollbar} orientation="vertical">
            <ScrollArea.Thumb className={styles.scrollAreaThumb} />
          </ScrollArea.Scrollbar>
          <ScrollArea.Scrollbar className={styles.scrollAreaScrollbar} orientation="horizontal">
            <ScrollArea.Thumb className={styles.scrollAreaThumb} />
          </ScrollArea.Scrollbar>
          <ScrollArea.Corner className={styles.scrollAreaCorner} />
        </ScrollArea.Root>
      </div>
    </div>
  );
};

export default CustomAudioPlayer;
