export const CRON_STRING_REGEX = /^[0-9,*-]+$/;

export const periodOptions = [
  { value: "year", label: "Year" },
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
  { value: "day", label: "Day" },
  { value: "hour", label: "Hour" },
  { value: "minute", label: "Minute" },
];

export const monthsOptions = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export const daysOfTheMonthOptions = new Array(32).fill(1, 1).map((_, i) => {
  return { value: i, label: i.toString() };
});

export const daysOfTheWeekOptions = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export const hoursOptions = new Array(24).fill(1).map((_, i) => {
  return { value: i, label: i.toString() };
});

export const minutesOptions = new Array(60).fill(1).map((_, i) => {
  return { value: i, label: i.toString() };
});
