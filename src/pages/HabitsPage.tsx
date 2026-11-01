import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/redux";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const HabitsPage = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold">My habits</h1>
      <p>Signed in as {user?.email}</p>
      <Button
        variant="outline"
        onClick={async () => {
          const { error } = await supabase.auth.signOut();
          if (error) toast.error(error.message);
        }}
      >
        Log out
      </Button>
    </main>
  );
};
export default HabitsPage;
