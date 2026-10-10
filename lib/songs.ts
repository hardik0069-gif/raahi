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

export const defaultModeSongs: Record<string, PlayerSong[]> = {
  "bus-wala": [
    {
      id: "bus-1",
      title: "Safar Ki Shuruaat",
      title_hindi: "सफ़र की शुरुआत",
      artist: "Desi Wheels",
      artist_hindi: "देसी पहिये",
      audio_url: "https://actions.google.com/sounds/v1/ambiences/bus_interior_moving.ogg",
      artwork_url: "/images/modes/bus-wala.webp",
      duration_seconds: 214,
      youtube_video_id: null,
    },
    {
      id: "bus-2",
      title: "Highway Ki Hawa",
      title_hindi: "हाइवे की हवा",
      artist: "Roadways Dhun",
      artist_hindi: "रोडवेज़ धुन",
      audio_url: "https://actions.google.com/sounds/v1/transportation/driving_in_car.ogg",
      artwork_url: "/images/modes/bus-wala.webp",
      duration_seconds: 188,
      youtube_video_id: null,
    },
    {
      id: "bus-3",
      title: "Khidki Wali Seat",
      title_hindi: "खिड़की वाली सीट",
      artist: "Raahi Ensemble",
      artist_hindi: "राही धुन",
      audio_url: "https://actions.google.com/sounds/v1/ambiences/outdoor_ambience_with_traffic.ogg",
      artwork_url: "/images/modes/bus-wala.webp",
      duration_seconds: 242,
      youtube_video_id: null,
    },
  ],
  "chai-tapri": [
    {
      id: "chai-1",
      title: "Adrak Wali Chai",
      title_hindi: "अदरक वाली चाय",
      artist: "Tapri Special",
      artist_hindi: "टपरी स्पेशल",
      audio_url: "https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg",
      artwork_url: "/images/modes/chai-tapri.webp",
      duration_seconds: 195,
      youtube_video_id: null,
    },
    {
      id: "chai-2",
      title: "Sadak Kinare Baatcheet",
      title_hindi: "सड़क किनारे बातचीत",
      artist: "Subah Ki Mahak",
      artist_hindi: "सुबह की महक",
      audio_url: "https://actions.google.com/sounds/v1/ambiences/morning_birds_and_breeze.ogg",
      artwork_url: "/images/modes/chai-tapri.webp",
      duration_seconds: 178,
      youtube_video_id: null,
    },
    {
      id: "chai-3",
      title: "Gupshup Aur Ghoont",
      title_hindi: "गपशप और घूंट",
      artist: "Nukkad Band",
      artist_hindi: "नुक्कड़ बैंड",
      audio_url: "https://actions.google.com/sounds/v1/ambiences/street_ambience.ogg",
      artwork_url: "/images/modes/chai-tapri.webp",
      duration_seconds: 210,
      youtube_video_id: null,
    },
  ],
  "raat-ki-shift": [
    {
      id: "raat-1",
      title: "Raat Ki Khamoshi",
      title_hindi: "रात की खामोशी",
      artist: "Neon Reverie",
      artist_hindi: "नियॉन लाइट्स",
      audio_url: "https://actions.google.com/sounds/v1/ambiences/night_crickets_and_wind.ogg",
      artwork_url: "/images/modes/raat-ki-shift.webp",
      duration_seconds: 230,
      youtube_video_id: null,
    },
    {
      id: "raat-2",
      title: "Shahar Jab Sota Hai",
      title_hindi: "शहर जब सोता है",
      artist: "Lo-Fi Raahi",
      artist_hindi: "लो-फ़ाई राही",
      audio_url: "https://actions.google.com/sounds/v1/weather/light_wind_through_trees.ogg",
      artwork_url: "/images/modes/raat-ki-shift.webp",
      duration_seconds: 205,
      youtube_video_id: null,
    },
    {
      id: "raat-3",
      title: "Der Raat Ki Coffee",
      title_hindi: "देर रात की कॉफी",
      artist: "Shift 03",
      artist_hindi: "शिफ्ट 03",
      audio_url: "https://actions.google.com/sounds/v1/ambiences/ambient_hum.ogg",
      artwork_url: "/images/modes/raat-ki-shift.webp",
      duration_seconds: 260,
      youtube_video_id: null,
    },
  ],
  "rajesh-carpenter": [
    {
      id: "carpenter-1",
      title: "Radio Ke Purane Geet",
      title_hindi: "रेडियो के पुराने गीत",
      artist: "All India Radio",
      artist_hindi: "आकाशवाणी",
      audio_url: "https://actions.google.com/sounds/v1/household/am_radio_tuning.ogg",
      artwork_url: "/images/modes/rajesh-carpenter.webp",
      duration_seconds: 220,
      youtube_video_id: null,
    },
    {
      id: "carpenter-2",
      title: "Lakdi Ki Khushboo",
      title_hindi: "लकड़ी की खुशबू",
      artist: "Rajesh Ustad",
      artist_hindi: "राजेश उस्ताद",
      audio_url: "https://actions.google.com/sounds/v1/tools/wood_sawing.ogg",
      artwork_url: "/images/modes/rajesh-carpenter.webp",
      duration_seconds: 195,
      youtube_video_id: null,
    },
  ],
  "raju-mistri": [
    {
      id: "mistri-1",
      title: "Subah Ka Paseena",
      title_hindi: "सुबह का पसीना",
      artist: "Raju Ustad",
      artist_hindi: "राजू उस्ताद",
      audio_url: "https://actions.google.com/sounds/v1/ambiences/construction_site.ogg",
      artwork_url: "/images/modes/raju-mistri.webp",
      duration_seconds: 180,
      youtube_video_id: null,
    },
    {
      id: "mistri-2",
      title: "Machine Ki Taal",
      title_hindi: "मशीन की ताल",
      artist: "Desi Beats",
      artist_hindi: "देसी बीट्स",
      audio_url: "https://actions.google.com/sounds/v1/household/clock_ticking.ogg",
      artwork_url: "/images/modes/raju-mistri.webp",
      duration_seconds: 190,
      youtube_video_id: null,
    },
  ],
  "safai-wala": [
    {
      id: "safai-1",
      title: "Jaagta Hua Shahar",
      title_hindi: "जागता हुआ शहर",
      artist: "Bhor Ki Kirnein",
      artist_hindi: "भोर की किरणें",
      audio_url: "https://actions.google.com/sounds/v1/ambiences/morning_birds.ogg",
      artwork_url: "/images/modes/safai-wala.webp",
      duration_seconds: 220,
      youtube_video_id: null,
    },
    {
      id: "safai-2",
      title: "Shaant Raaste",
      title_hindi: "शांत रास्ते",
      artist: "Savera",
      artist_hindi: "सवेरा",
      audio_url: "https://actions.google.com/sounds/v1/ambiences/park_ambience.ogg",
      artwork_url: "/images/modes/safai-wala.webp",
      duration_seconds: 198,
      youtube_video_id: null,
    },
  ],
  "saloon": [
    {
      id: "saloon-1",
      title: "Cassette Ki Purani Reel",
      title_hindi: "कैसेट की पुरानी रील",
      artist: "Chotu Barber",
      artist_hindi: "छोटू नाई",
      audio_url: "https://actions.google.com/sounds/v1/household/hair_clippers.ogg",
      artwork_url: "/images/modes/saloon.webp",
      duration_seconds: 240,
      youtube_video_id: null,
    },
    {
      id: "saloon-2",
      title: "Aaine Mein Chehra",
      title_hindi: "आईने में चेहरा",
      artist: "90s Ka Zamana",
      artist_hindi: "90s का जमाना",
      audio_url: "https://actions.google.com/sounds/v1/household/scissors_cutting.ogg",
      artwork_url: "/images/modes/saloon.webp",
      duration_seconds: 210,
      youtube_video_id: null,
    },
  ],
  "truck-wala": [
    {
      id: "truck-1",
      title: "GT Road Ki Dhun",
      title_hindi: "जी टी रोड की धुन",
      artist: "Sher-e-Punjab",
      artist_hindi: "शेर-ए-पंजाब",
      audio_url: "https://actions.google.com/sounds/v1/transportation/semi_truck_idle.ogg",
      artwork_url: "/images/modes/truck-wala.webp",
      duration_seconds: 234,
      youtube_video_id: null,
    },
    {
      id: "truck-2",
      title: "Dhabe Ki Roti",
      title_hindi: "ढाबे की रोटी",
      artist: "Highway Kings",
      artist_hindi: "हाईवे किंग्स",
      audio_url: "https://actions.google.com/sounds/v1/ambiences/outdoor_restaurant.ogg",
      artwork_url: "/images/modes/truck-wala.webp",
      duration_seconds: 212,
      youtube_video_id: null,
    },
  ],
  "kk": [
    {
      id: "kk-1",
      title: "Yaadon Ke Galiyare",
      title_hindi: "यादों के गलियारे",
      artist: "KK Tribute",
      artist_hindi: "केके ट्रिब्यूट",
      audio_url: "https://actions.google.com/sounds/v1/music/acoustic_guitar_mellow.ogg",
      artwork_url: "/images/modes/kk.webp",
      duration_seconds: 275,
      youtube_video_id: null,
    },
    {
      id: "kk-2",
      title: "Safar Ka Humsafar",
      title_hindi: "सफ़र का हमसफ़र",
      artist: "KK Swar",
      artist_hindi: "केके स्वर",
      audio_url: "https://actions.google.com/sounds/v1/music/piano_sentimental.ogg",
      artwork_url: "/images/modes/kk.webp",
      duration_seconds: 248,
      youtube_video_id: null,
    },
  ],
  "monsoon": [
    {
      id: "monsoon-1",
      title: "Pehli Baarish (Mitti Ki Khushboo)",
      title_hindi: "पहली बारिश (मिट्टी की खुशबू)",
      artist: "Rimjhim Dhun",
      artist_hindi: "रिमझिम धुन",
      audio_url: "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg",
      artwork_url: "/images/modes/monsoon.webp",
      duration_seconds: 260,
      youtube_video_id: null,
    },
    {
      id: "monsoon-2",
      title: "Bheegi Khidkiyan",
      title_hindi: "भीगी खिड़कियाँ",
      artist: "Megh Malhar",
      artist_hindi: "मेघ मल्हार",
      audio_url: "https://actions.google.com/sounds/v1/weather/gentle_rain_against_window.ogg",
      artwork_url: "/images/modes/monsoon.webp",
      duration_seconds: 245,
      youtube_video_id: null,
    },
  ],
  "midnight": [
    {
      id: "mid-1",
      title: "Aadhi Raat Ka Safar",
      title_hindi: "आधी रात का सफ़र",
      artist: "Taare Aur Tanhai",
      artist_hindi: "तारे और तन्हाई",
      audio_url: "https://actions.google.com/sounds/v1/ambiences/night_suburb_crickets.ogg",
      artwork_url: "/images/modes/midnight.webp",
      duration_seconds: 250,
      youtube_video_id: null,
    },
    {
      id: "mid-2",
      title: "Dheemi Batti",
      title_hindi: "धीमी बत्ती",
      artist: "Raahi Ambience",
      artist_hindi: "राही एंबियेंस",
      audio_url: "https://actions.google.com/sounds/v1/weather/wind_in_desert.ogg",
      artwork_url: "/images/modes/midnight.webp",
      duration_seconds: 235,
      youtube_video_id: null,
    },
  ],
  "lofi-study": [
    {
      id: "study-1",
      title: "Gahra Dhyan",
      title_hindi: "गहरा ध्यान",
      artist: "Focus Raahi",
      artist_hindi: "फोकस राही",
      audio_url: "https://actions.google.com/sounds/v1/ambiences/library_quiet.ogg",
      artwork_url: "/images/modes/lofi-study.webp",
      duration_seconds: 210,
      youtube_video_id: null,
    },
    {
      id: "study-2",
      title: "Dheemi Kitabein",
      title_hindi: "धीमी किताबें",
      artist: "Study Lo-Fi",
      artist_hindi: "स्टडी लो-फ़ाई",
      audio_url: "https://actions.google.com/sounds/v1/household/turning_book_pages.ogg",
      artwork_url: "/images/modes/lofi-study.webp",
      duration_seconds: 245,
      youtube_video_id: null,
    },
  ],
};

export async function getModeSongs(
  modeId: string
): Promise<PlayerSong[]> {
  try {
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

    if (!error && data && data.length > 0) {
      const rows = data as unknown as ModeSongRow[];
      const songs = rows
        .map((row) => {
          if (!row.songs) {
            return null;
          }
          if (Array.isArray(row.songs)) {
            return row.songs[0] ?? null;
          }
          return row.songs;
        })
        .filter((song): song is PlayerSong => song !== null);

      if (songs.length > 0) {
        return songs;
      }
    }
  } catch (err) {
    console.warn("Supabase mode_songs fetch skipped or failed, using curated library:", err);
  }

  return defaultModeSongs[modeId] ?? defaultModeSongs["bus-wala"] ?? [];
}