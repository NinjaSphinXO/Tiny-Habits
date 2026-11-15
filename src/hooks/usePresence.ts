import type { PresenceUser } from "@/types";
import { useAppSelector } from "@/hooks/redux";
import { USERNAME_FALLBACK } from "@/lib/user";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const usePresence = (): PresenceUser[] => {
  const userId = useAppSelector((state) => state.auth.user?.id);

  const username = useAppSelector((state) => {
    const name = state.auth.user?.user_metadata?.username;

    return typeof name === "string" && name.trim() ? name : USERNAME_FALLBACK;
  });

  const [usersState, setUsersState] = useState<PresenceUser[]>([]);

  useEffect(() => {
    if (!userId) {
      setUsersState([]);
      return;
    }

    const channel = supabase.channel("habits-presence");

    channel
      .on("presence", { event: "sync" }, () => {
        const presenceState = channel.presenceState<PresenceUser>();

        const users = Object.values(presenceState).flat();

        // 1. Remove duplicate users
        const usersMap = new Map(
          users.map((presenceUser) => [presenceUser.user_id, presenceUser]),
        );

        // 2. Convert Map values into an array
        const uniqueUsers = [...usersMap.values()];

        // 3. Sort users alphabetically
        uniqueUsers.sort((a, b) => a.username.localeCompare(b.username));

        setUsersState(uniqueUsers);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          try {
            await channel.track({
              user_id: userId,
              username,
            });
          } catch (error) {
            console.error("Failed to track presence:", error);
          }
        }
      });

    return () => {
      setUsersState([]);
      supabase.removeChannel(channel);
    };
  }, [userId, username]);

  return usersState;
};
