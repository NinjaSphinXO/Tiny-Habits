import { useEffect } from "react";
import { useAppDispatch } from "../hooks/redux";
import { supabase } from "../lib/supabase";
import { setUser } from "../store/authSlice";

const AuthListener = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setUser(session?.user ?? null));
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);
  return null;
};
export default AuthListener;
