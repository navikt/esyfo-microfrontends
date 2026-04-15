const MILLISEKUNDER_PER_DAG = 86400000;
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const toDateObject = (date: string | number | Date) => {
  if (date instanceof Date) {
    return date;
  }

  if (typeof date === "string" && DATE_ONLY_PATTERN.test(date)) {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(date);
};

export const getLongDateFormat = (date: string | number | Date) => {
  const dateObject = toDateObject(date);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return dateObject.toLocaleDateString("nb-NO", options);
};

export const getShortDateFormat = (date: string | number | Date) => {
  const dateObject = toDateObject(date);

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
