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

  useEffect(() => {
    const supabase =
      createClient();

    const channel =
      supabase.channel(
        `listening:${modeId}`,
        {
          config: {
            presence: {
              key: crypto.randomUUID(),
            },
          },
        }
      );

    channelRef.current =
      channel;

    const updateCount =
      () => {
        const state =
          channel.presenceState();

        setListenerCount(
          Object.keys(state).length
        );
      };

    channel.on(
      "presence",
      {
        event: "sync",
      },
      updateCount
    );

    channel.on(
      "presence",
      {
        event: "join",
      },
      updateCount
    );

    channel.on(
      "presence",
      {
        event: "leave",
      },
      updateCount
    );

    channel.subscribe(
      (status) => {
        if (
          status ===
          "SUBSCRIBED"
        ) {
          updateCount();
        }
      }
    );

    return () => {
      channel.untrack();

      supabase.removeChannel(
        channel
      );

      channelRef.current =
        null;
    };
  }, [modeId]);

  useEffect(() => {
    const channel =
      channelRef.current;

    if (!channel) {
      return;
    }

    if (isPlaying) {
      channel.track({
        mode_id: modeId,
        listening: true,
        started_at:
          new Date().toISOString(),
      });
    } else {
      channel.untrack();
    }
  }, [
    isPlaying,
    modeId,
  ]);

  if (
    !isPlaying ||
    listenerCount === 0
  ) {
    return null;
  }

  return (
    <div className="listening-indicator player-listening-indicator">
      <span className="listening-dot" />

      <span>
        {listenerCount} listening
      </span>
    </div>
  );
}