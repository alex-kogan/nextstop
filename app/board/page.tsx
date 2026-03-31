import { createClient } from "@/lib/supabase/server";
import DepartureBoard from "@/components/board/DepartureBoard";
import EmptyState from "@/components/board/EmptyState";

export default async function BoardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: stops } = await supabase
    .from("user_stops")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: true });

  if (!stops || stops.length === 0) {
    return <EmptyState />;
  }

  return <DepartureBoard initialStops={stops} />;
}
