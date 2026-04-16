const MILLISEKUNDER_PER_DAG = 86400000;

export const getLongDateFormat = (date: string | number | Date) => {
  const dateObject = new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return dateObject.toLocaleDateString("nb-NO", options);
};

export const getShortDateFormat = (date: string | number | Date) => {
  const dateObject = new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    dateStyle: "short",
  };
  return dateObject.toLocaleDateString("nb-NO", options);
};

export function addDaysToDate(date: Date, daysToAdd: number) {
  const nyDato = new Date(date);
  const newTime = nyDato.getTime() + daysToAdd * MILLISEKUNDER_PER_DAG;
  nyDato.setTime(newTime);
  return nyDato;
}

export const toLocalDateTime = (date: Date): string =>
  date.toISOString().replace("Z", "");

export const toLocalDate = (date: Date): string =>
  date.toISOString().split("T")[0];
