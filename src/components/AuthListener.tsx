import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/hooks/redux";
import { supabase } from "@/lib/supabase";
import { setUser } from "@/store/authSlice";

// Must be rendered inside <QueryClientProvider> (it is, in main.tsx).
const AuthListener = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      dispatch(setUser(session?.user ?? null));

      // Drop every cached query when the user signs out (button, expired session,
      // or sign-out in another tab) so the previous user's data never lingers.
      // clear() is synchronous, so this callback stays safe (no awaiting Supabase here).
      if (event === "SIGNED_OUT") queryClient.clear();
    });

    return () => subscription.unsubscribe();
  }, [dispatch, queryClient]);

  return null;
};

export default AuthListener;