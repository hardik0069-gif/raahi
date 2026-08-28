import RaahiSidebar from "@/components/navigation/RaahiSidebar";
import ModeGrid from "@/components/modes/ModeGrid";
import { createClient } from "@/lib/supabase/server";

function getModeImage(modeId: string) {
  return `/images/modes/${modeId}.webp`;
}

export default async function ModesPage() {
  const supabase = await createClient();

  const { data: databaseModes, error } = await supabase
    .from("modes")
    .select("id, name, hindi_name, description")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load modes:", error);
  }

  const modes =
    databaseModes?.map((mode) => ({
      id: mode.id,
      name: mode.name,
      hindiName: mode.hindi_name,
      description: mode.description ?? "",
      image: getModeImage(mode.id),
    })) ?? [];

  return (
    <main className="modes-page-new">
      <RaahiSidebar />

      <section className="modes-page-layout">
        <div className="modes-page-heading">
          <h1>Choose your mode</h1>
        </div>

        <div className="modes-page-list">
          {modes.length > 0 ? (
            <ModeGrid modes={modes} />
          ) : (
            <p className="modes-empty">
              No modes available.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}