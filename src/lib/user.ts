import type { User } from "@supabase/supabase-js";

/**
 * Returns the best available display name for a user:
 * 1. user_metadata.username — only if it is a non-empty string
 * 2. email — otherwise
 * 3. "" — if the user is null
 */
export function getDisplayName(user: User | null): string {
  if (!user) return "";
  const username = user.user_metadata?.username;
  if (typeof username === "string" && username) return username;
  return user.email ?? "";
}
