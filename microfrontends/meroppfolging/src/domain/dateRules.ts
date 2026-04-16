const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

export const isRespondedWithinOneWeek = (
  responseDateTime: Date | null | undefined,
  evaluatedAt: Date,
): responseDateTime is Date => {
  if (!responseDateTime) return false;

  const oneWeekAgo = new Date(evaluatedAt.getTime() - ONE_WEEK_IN_MS);

  return responseDateTime > oneWeekAgo;
};
