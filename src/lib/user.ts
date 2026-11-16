import type { User } from "@supabase/supabase-js";

// Shown when a user has no usable name. Neutral on purpose.
export const USERNAME_FALLBACK = "someone";

/**
 * Best available display name for a user:
 * 1. user_metadata.username (only if it is a non-empty string)
 * 2. the email (accounts created before usernames existed)
 * 3. USERNAME_FALLBACK (no user)
 *
 * Only for the page header. NEVER use this in presence payloads: the email
 * would be visible to every connected user.
 */
export function getDisplayName(user: User | null): string {
  if (!user) return USERNAME_FALLBACK;
  const username = user.user_metadata?.username;
  if (typeof username === "string" && username.trim()) return username;
  return user.email ?? USERNAME_FALLBACK;
}