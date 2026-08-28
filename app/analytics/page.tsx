import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type SongStat = {
  song_id: string;
  song_title: string;
  song_artist: string;
  total_sessions: number;
  total_listening_seconds: number;
};

type ModeStat = {
  mode_id: string;
  total_sessions: number;
  total_listening_seconds: number;
};

function formatDuration(seconds: number) {
  const total = Math.max(0, Number(seconds) || 0);

  const minutes = Math.floor(total / 60);
  const remainingSeconds = total % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }

  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

function formatModeName(name: string | null, modeId: string) {
  return name?.trim() || modeId;
}

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const [
    { data: songStats, error: songError },
    { data: modeStats, error: modeError },
    { count: totalSessions, error: sessionError },
    { data: durationRows, error: durationError },
    { data: databaseModes, error: modesError },
  ] = await Promise.all([
    supabase.rpc("get_raahi_song_stats"),

    supabase
      .from("listening_sessions")
      .select("mode_id, duration_seconds"),

    supabase
      .from("listening_sessions")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("listening_sessions")
      .select("duration_seconds"),

    supabase
      .from("modes")
      .select("id, name, hindi_name"),
  ]);

  if (songError) {
    console.error("Analytics song stats error:", songError);
  }

  if (modeError) {
    console.error("Analytics mode stats error:", modeError);
  }

  if (sessionError) {
    console.error("Analytics session count error:", sessionError);
  }

  if (durationError) {
    console.error("Analytics duration error:", durationError);
  }

  if (modesError) {
    console.error("Analytics modes error:", modesError);
  }

  const songs = (songStats ?? []) as SongStat[];

  const modeMap = new Map<string, ModeStat>();

  for (const row of modeStats ?? []) {
    const existing = modeMap.get(row.mode_id);

    if (existing) {
      existing.total_sessions += 1;
      existing.total_listening_seconds +=
        Number(row.duration_seconds) || 0;
    } else {
      modeMap.set(row.mode_id, {
        mode_id: row.mode_id,
        total_sessions: 1,
        total_listening_seconds:
          Number(row.duration_seconds) || 0,
      });
    }
  }

  const modeNameMap = new Map(
    (databaseModes ?? []).map((mode) => [
      mode.id,
      formatModeName(mode.hindi_name || mode.name, mode.id),
    ])
  );

  const modes = Array.from(modeMap.values()).sort(
    (a, b) => b.total_sessions - a.total_sessions
  );

  const totalListeningSeconds = (durationRows ?? []).reduce(
    (sum, row) => sum + (Number(row.duration_seconds) || 0),
    0
  );

  return (
    <main className="analytics-page">
      <header className="analytics-header">
        <Link href="/" className="analytics-back">
          ←
        </Link>

        <div className="analytics-brand">
          RAAHI<span>.</span>
        </div>
      </header>

      <section className="analytics-intro">
        <p className="analytics-label">LISTENING ANALYTICS</p>

        <h1>
          Your
          <br />
          <em>journey.</em>
        </h1>

        <p className="analytics-description">
          A quiet look at what you have been listening to.
        </p>
      </section>

      <section className="analytics-content">
        <div className="analytics-summary">
          <div className="analytics-stat">
            <span>Total plays</span>
            <strong>{totalSessions ?? 0}</strong>
          </div>

          <div className="analytics-stat">
            <span>Listening time</span>
            <strong>
              {formatDuration(totalListeningSeconds)}
            </strong>
          </div>
        </div>

        <section className="analytics-section">
          <div className="analytics-section-heading">
            <span>01</span>
            <h2>Modes</h2>
          </div>

          {modes.length === 0 ? (
            <div className="analytics-empty">
              No listening sessions yet.
            </div>
          ) : (
            <div className="analytics-list">
              {modes.map((mode) => (
                <div
                  className="analytics-row"
                  key={mode.mode_id}
                >
                  <div>
                    <strong>
                      {modeNameMap.get(mode.mode_id) ?? mode.mode_id}
                    </strong>

                    <span>
                      {mode.total_sessions}{" "}
                      {mode.total_sessions === 1
                        ? "play"
                        : "plays"}
                    </span>
                  </div>

                  <strong>
                    {formatDuration(
                      mode.total_listening_seconds
                    )}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="analytics-section">
          <div className="analytics-section-heading">
            <span>02</span>
            <h2>Songs</h2>
          </div>

          {songs.length === 0 ? (
            <div className="analytics-empty">
              No song analytics yet.
            </div>
          ) : (
            <div className="analytics-list">
              {songs.map((song, index) => (
                <div
                  className="analytics-row"
                  key={song.song_id}
                >
                  <div className="analytics-song">
                    <span className="analytics-rank">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div>
                      <strong>{song.song_title}</strong>

                      <span>{song.song_artist}</span>
                    </div>
                  </div>

                  <div className="analytics-song-meta">
                    <span>
                      {song.total_sessions}{" "}
                      {song.total_sessions === 1
                        ? "play"
                        : "plays"}
                    </span>

                    <strong>
                      {formatDuration(
                        song.total_listening_seconds
                      )}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}