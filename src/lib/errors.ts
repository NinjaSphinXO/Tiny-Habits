export const isUniqueViolation = (error: unknown) => {
  if (error === null || typeof error !== "object" || !("code" in error)) return false;
  return error.code === "23505";
};
