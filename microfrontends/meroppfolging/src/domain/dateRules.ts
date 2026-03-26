const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

export const isRespondedWithinOneWeek = (
  responseDateTime: string | null | undefined,
  evaluatedAt: Date,
): responseDateTime is string => {
  if (!responseDateTime) return false;

  const responseDate = new Date(responseDateTime);
  const oneWeekAgo = new Date(evaluatedAt.getTime() - ONE_WEEK_IN_MS);

  return responseDate > oneWeekAgo;
};
