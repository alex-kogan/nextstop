import { createClient } from "@/lib/supabase/server";
import StopManager from "@/components/stops/StopManager";

export default async function StopsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: savedStops } = await supabase
    .from("user_stops")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: true });

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-medium tracking-tight">My Stops</h1>
        <p className="text-muted text-sm mt-1 font-light">
          Search for Swiss transit stops by name or address, then save your favorites.
        </p>
      </div>
      <StopManager initialSavedStops={savedStops ?? []} />
    </div>
  );
}
