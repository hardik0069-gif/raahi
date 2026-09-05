"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";

type ListeningIndicatorProps = {
  modeId: string;
  isPlaying: boolean;
};

export default function ListeningIndicator({
  modeId,
  isPlaying,
}: ListeningIndicatorProps) {
  const [listenerCount, setListenerCount] =
    useState(0);

  const channelRef =
    useRef<
      ReturnType<
        ReturnType<
          typeof createClient
        >["channel"]
      > | null
    >(null);

  const isSubscribedRef = useRef(false);

  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const supabase = createClient();

    const presenceKey =
      typeof crypto !== "undefined" &&
      crypto.randomUUID
        ? crypto.randomUUID()
        : `listener-${Date.now()}-${Math.random()}`;

    const channel = supabase.channel(
      `listening:${modeId}`,
      {
        config: {
          presence: {
            key: presenceKey,
          },
        },
      }
    );

    channelRef.current = channel;

    const updateListenerCount = () => {
      const state = channel.presenceState();

      setListenerCount(
        Object.keys(state).length
      );
    };

    channel.on(
      "presence",
      {
        event: "sync",
      },
      updateListenerCount
    );

    channel.on(
      "presence",
      {
        event: "join",
      },
      updateListenerCount
    );

    channel.on(
      "presence",
      {
        event: "leave",
      },
      updateListenerCount
    );

    channel.subscribe(async (status) => {
      if (status !== "SUBSCRIBED") {
        return;
      }

      isSubscribedRef.current = true;

      if (isPlayingRef.current) {
        await channel.track({
          mode_id: modeId,
          listening: true,
          started_at:
            new Date().toISOString(),
        });
      }

      updateListenerCount();
    });

    return () => {
      isSubscribedRef.current = false;

      channel.untrack();

      supabase.removeChannel(channel);

      channelRef.current = null;
    };
  }, [modeId]);

  useEffect(() => {
    const channel = channelRef.current;

    if (!channel || !isSubscribedRef.current) {
      return;
    }

    const updatePresence = async () => {
      if (isPlaying) {
        await channel.track({
          mode_id: modeId,
          listening: true,
          started_at:
            new Date().toISOString(),
        });
      } else {
        await channel.untrack();
      }
    };

    updatePresence();
  }, [isPlaying, modeId]);

  /*
   * Indicator sirf playback ke time show hoga.
   * Supabase count late aaye tab bhi kam se kam
   * current user ko 1 listener dikhayega.
   */
  if (!isPlaying) {
    return null;
  }

  const displayCount = Math.max(
    1,
    listenerCount
  );

  return (
    <div
      className="
        listening-indicator
        player-listening-indicator
      "
      role="status"
      aria-live="polite"
    >
      <span
        className="listening-dot"
        aria-hidden="true"
      />

      <span className="listening-indicator-text">
        {displayCount === 1
          ? "1 listening"
          : `${displayCount} listening`}
      </span>
    </div>
  );
}