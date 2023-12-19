// Crontab.d.ts

/**
 * Crontab component
 * @component
 * @param {object} props - Props object
 * @param {boolean} [props.shortSelectedOptions=true] - Whether to display shortened selected options
 * @param {string} [props.invalidCronStringErrorMessage=""] - Error message to display if the cron string is invalid
 * @param {string} [props.value=""] - Cron string value to initialize the component with.
 * @returns {JSX.Element} - Crontab component JSX element
 */
declare function Crontab(props: {
  value: string;
  invalidCronStringErrorMessage: number;
  shortSelectedOptions: boolean;
}): JSX.Element;

export default Crontab;
