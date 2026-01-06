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

export const getFormattedMonth = (date: string | number | Date) => {
  const dateObject = new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
  };
  return dateObject.toLocaleDateString("nb-NO", options);
};

export const getFormattedTime = (date: string | number | Date) => {
  const dateObject = new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };
  return dateObject.toLocaleTimeString("nb-NO", options);
};

export const getFullDateFormat = (date: string | number | Date) => {
  const dateObject = new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return dateObject.toLocaleDateString("nb-NO", options);
};

export const isDateInPast = (dateTime: string | number | Date) => {
  const date = new Date(dateTime);
  const today = new Date();

  return today > date;
};

export const minutesToMillis = (minutes: number) => {
  return 1000 * 60 * minutes;
};

export function addDaysToDate(date: Date, daysToAdd: number) {
  const nyDato = new Date(date);
  const newTime = nyDato.getTime() + daysToAdd * MILLISEKUNDER_PER_DAG;
  nyDato.setTime(newTime);
  return nyDato;
}

export function subtractDaysFromDate(date: Date, daysToSubtract: number) {
  const nyDato = new Date(date);
  const newTime = nyDato.getTime() - daysToSubtract * MILLISEKUNDER_PER_DAG;
  nyDato.setTime(newTime);
  return nyDato;
}
