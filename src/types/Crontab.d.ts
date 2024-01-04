// Crontab.d.ts

/**
 * Crontab component
 * @component
 * @param {object} props - Props object
 * @param {boolean} [props.shortSelectedOptions=true] - Whether to display shortened selected options
 * @param {string} [props.invalidCronStringErrorMessage=""] - Error message to display if the cron string is invalid
 * @param {string} [props.value=""] - Cron string value to initialize the component with.
 * @param {function} [props.onChange=() => {}] - its a callback function that'll return an object every time any cron value changes
 * @returns {JSX.Element} - Crontab component JSX element
 */
declare function Crontab(props: {
  value: string;
  invalidCronStringErrorMessage: number;
  shortSelectedOptions: boolean;
  disabled: boolean;
  onChange: (value: string) => {
    value: string;
    error: boolean;
    minutes: string;
    hours: string;
    daysOfTheMonth: string;
    months: string;
    daysOfTheWeek: string;
  };
  // onClear: () => void;
  // onValidate: (value: string) => void;
  // onInvalid: (value: string) => void;
  // onValid: (value: string) => void;
  // onInvalidCronString: (value: string) => void;
  // onValidCronString: (value: string) => void;
  // onInvalidCronStringErrorMessage: (value: string) => void;
  // onValidCronStringErrorMessage: (value: string) => void;
  // onInvalidCronStringErrorMessage: (value: string) => void;
  // onValidCronStringErrorMessage: (value: string) => void;
  // onInvalidCronStringErrorMessage: (value: string) => void;
  // onValidCronStringErrorMessage: (value: string) => void;
  // onInvalidCronStringErrorMessage: (value: string) => void;
  // onValidCronStringErrorMessage: (value: string) => void;
  // onInvalidCronStringErrorMessage: (value: string) => void;
}): JSX.Element;

export default Crontab;
