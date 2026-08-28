import { createClient } from "@/lib/supabase/server";

export type PlayerSong = {
  id: string;
  title: string;
  title_hindi: string | null;
  artist: string | null;
  artist_hindi: string | null;

  audio_url: string | null;
  artwork_url: string | null;
  duration_seconds: number | null;
  youtube_video_id: string | null;
};

type ModeSongRow = {
  position: number;
  songs:
    | PlayerSong
    | PlayerSong[]
    | null;
};

export async function getModeSongs(
  modeId: string
): Promise<PlayerSong[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mode_songs")
    .select(`
      position,
      songs (
        id,
        title,
        title_hindi,
        artist,
        artist_hindi,
        audio_url,
        artwork_url,
        duration_seconds,
        youtube_video_id
      )
    `)
    .eq("mode_id", modeId)
    .order("position", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Failed to load mode songs:",
      error
    );

    return [];
  }

  const rows =
    (data ?? []) as unknown as ModeSongRow[];

  return rows
    .map((row) => {
      if (!row.songs) {
        return null;
      }

      if (Array.isArray(row.songs)) {
        return row.songs[0] ?? null;
      }

      return row.songs;
    })
    .filter(
      (song): song is PlayerSong =>
        song !== null
    );
}