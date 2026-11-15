import type { PresenceUser } from "@/types";

export interface OnlineBadgeProps {
  users: PresenceUser[];
  currentUserId?: string;
}

const MAX_VISIBLE_USERS = 5;

const getVisibleUsers = (
  users: PresenceUser[],
  currentUserId?: string,
): PresenceUser[] => {
  if (users.length <= MAX_VISIBLE_USERS) {
    return users;
  }

  const currentUserIndex = currentUserId
    ? users.findIndex((user) => user.user_id === currentUserId)
    : -1;

  if (currentUserIndex >= MAX_VISIBLE_USERS) {
    return [...users.slice(0, MAX_VISIBLE_USERS - 1), users[currentUserIndex]];
  }

  return users.slice(0, MAX_VISIBLE_USERS);
};

const OnlineBadge = ({ users, currentUserId }: OnlineBadgeProps) => {
  const hasUsers = users.length > 0;
  const visibleUsers = getVisibleUsers(users, currentUserId);
  const remainingCount = users.length - visibleUsers.length;

  return (
    <div className="flex items-center gap-2 text-sm">
      {/* Decorative status dot */}
      {hasUsers && (
        <span
          className="inline-block size-2 rounded-full bg-green-500"
          aria-hidden="true"
        />
      )}

      {/* Live region: always rendered */}
      <span role="status">{hasUsers ? `${users.length} online` : ""}</span>

      {/* Names list: rendered only when there are users */}
      {hasUsers && (
        <ul aria-label="Online users" className="flex items-center gap-2 flex-wrap">
          {visibleUsers.map((user) => {
            const isCurrent = Boolean(currentUserId && user.user_id === currentUserId);

            return (
              <li key={user.user_id} className="inline-flex items-center">
                <span
                  className="inline-block max-w-[120px] truncate align-bottom"
                  title={user.username}
                >
                  {user.username}
                </span>
                {isCurrent && <span className="ms-1 text-muted-foreground">(you)</span>}
              </li>
            );
          })}

          {remainingCount > 0 && (
            <li className="text-muted-foreground">+{remainingCount} more</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default OnlineBadge;
