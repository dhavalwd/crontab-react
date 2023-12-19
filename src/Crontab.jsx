import { useEffect, useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";

import "./App.css";
import { groupConsecutiveNumbers, range } from "./utils";
import {
  CRON_STRING_REGEX,
  daysOfTheMonthOptions,
  daysOfTheWeekOptions,
  hoursOptions,
  minutesOptions,
  monthsOptions,
  periodOptions,
} from "./constants";

const DEFAULT_CRON = {
  minutes: "*",
  hours: "*",
  months: "*",
  daysOfTheMonth: "*",
  daysOfTheWeek: "*",
};

const ALPHABETS_REGEX = /[a-z]/i;

const DEFAULT_CRON_SELECTED = {
  minutes: [],
  hours: [],
  months: [],
  daysOfTheMonth: [],
  daysOfTheWeek: [],
};

const CRON_VALUE_MAP = {
  0: "minutes",
  1: "hours",
  2: "daysOfTheMonth",
  3: "months",
  4: "daysOfTheWeek",
};

const CRON_OPTIONS_MAP = {
  0: minutesOptions,
  1: hoursOptions,
  2: daysOfTheMonthOptions,
  3: monthsOptions,
  4: daysOfTheWeekOptions,
};

const DEFAULT_CRON_STRING = "* * * * *";

/**
 * Crontab component
 * @component
 * @param {object} props - Props object
 * @param {boolean} [props.shortSelectedOptions=true] - Whether to display shortened selected options
 * @param {string} [props.invalidCronStringErrorMessage=""] - Error message to display if the cron string is invalid
 * @param {string} [props.value=""] - Cron string value to initialize the component with.
 * @returns {JSX.Element} - Crontab component JSX element
 */
function Crontab(props) {
  const {
    shortSelectedOptions = true,
    invalidCronStringErrorMessage = "",
    value = "",
  } = props;
  const [period, setPeriod] = useState({ value: "minute", label: "Minute" });
  const [cronValue, setCronValue] = useState(DEFAULT_CRON);
  const [cronString, setCronString] = useState(value || DEFAULT_CRON_STRING);
  const [selectedMinutes, setSelectedMinutes] = useState("");
  const [selectedHours, setSelectedHours] = useState("");
  const [selectedDaysOfTheMonth, setSelectedDaysOfTheMonth] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDaysOfTheWeek, setSelectedDaysOfTheWeek] = useState("");
  const [errors, setErrors] = useState({});

  const [selectedValues, setSelectedValues] = useState(DEFAULT_CRON_SELECTED);

  // Set cron string value based on its value changes
  useEffect(() => {
    setCronString(
      `${cronValue.minutes} ${cronValue.hours} ${cronValue.daysOfTheMonth} ${cronValue.months} ${cronValue.daysOfTheWeek}`
    );
  }, [cronValue]);

  useEffect(() => {
    if (value) {
      setCronString(value);
      handleCronInputBlur(value);
    }
  }, [value]);

  const dot = (color = "transparent") => ({
    alignItems: "center",
    display: "flex",

    ":before": {
      backgroundColor: color,
      borderRadius: 10,
      content: '" "',
      display: "block",
      marginRight: 8,
      height: 10,
      width: 10,
    },
  });

  const colorStyles = {
    control: (styles) => ({ ...styles, backgroundColor: "white" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? "#1e99fa"
          : isFocused
          ? "grey"
          : undefined,
        color: isDisabled ? "#ccc" : isSelected ? "white" : "black",
        cursor: isDisabled ? "not-allowed" : "default",

        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled
            ? isSelected
              ? "#1e99fa"
              : "grey"
            : undefined,
        },
      };
    },
    input: (styles) => ({ ...styles, ...dot() }),
    placeholder: (styles) => ({ ...styles, ...dot("#ccc") }),
    singleValue: (styles, { data }) => ({ ...styles, ...dot("grey") }),
  };

  const shortFormatOptionLabel = ({ value, label }, { context }) => {
    return context === "menu" ? (
      <div style={{ display: "flex" }}>
        <div style={{ marginLeft: "4px", color: "#666" }}>{label}</div>
      </div>
    ) : (
      <div style={{ display: "flex" }}>
        <div style={{ marginLeft: "4px", color: "#666" }}>
          {label.substring(0, 3)}
        </div>
      </div>
    );
  };

  const handleChange = (newSelectedOptions, name) => {
    if (newSelectedOptions.length > 0) {
      const sortedSelectedOptions = [...newSelectedOptions].sort(
        (a, b) => a.value - b.value
      );
      const sortedSelectedValues = sortedSelectedOptions.map(
        (item) => item.value
      );

      const cronStringForField = groupConsecutiveNumbers(sortedSelectedValues);

      setSelectedValues((prevState) => ({
        ...prevState,
        [name]: newSelectedOptions,
      }));

      setCronValue((prevState) => ({
        ...prevState,
        [name]: cronStringForField,
      }));
    } else {
      setSelectedValues((prevState) => ({
        ...prevState,
        [name]: "*",
      }));

      setCronValue((prevState) => ({
        ...prevState,
        [name]: "*",
      }));
    }
  };

  const validateAllowedValues = (arrayOfNumbers, index) => {
    if (index === 0) {
      return arrayOfNumbers.some((number) => number < 0 || number > 59);
    } else if (index === 1) {
      return arrayOfNumbers.some((number) => number < 0 || number > 23);
    } else if (index === 2) {
      return arrayOfNumbers.some((number) => number < 1 || number > 31);
    } else if (index === 3) {
      return arrayOfNumbers.some((number) => number < 1 || number > 12);
    } else if (index === 4) {
      return arrayOfNumbers.some((number) => number < 1 || number > 7);
    }
    return false;
  };

  const validHyphenRange = (value, index) => {
    const splitItem = value.split("-");

    if (splitItem[0] >= splitItem[1]) {
      return false;
    }

    const arrayOfNumbers = range(Number(splitItem[0]), Number(splitItem[1]), 1);

    return validateAllowedValues(arrayOfNumbers, index);
  };

  const validateCronInput = (cronInputValue) => {
    if (cronInputValue === DEFAULT_CRON_STRING) {
      return true;
    }

    if (ALPHABETS_REGEX.test(cronInputValue)) {
      return false;
    }

    const cronInputArray = cronInputValue.split(" ");

    if (cronInputArray.length !== 5) {
      return false;
    }

    cronInputArray.forEach((item, index) => {
      if (item.includes(",")) {
        const itemArr = item.split(",");

        itemArr.forEach((item) => {
          if (item.includes("-")) {
            return validHyphenRange(item, index);
          } else {
            return validateAllowedValues([item], index);
          }
        });
      } else if (item.includes("-")) {
        return validHyphenRange(item, index);
      } else {
        return validateAllowedValues([item], index);
      }
    });

    return true;
  };

  const handleCronInputHyphenRange = (value, index) => {
    const splitOptions = value.split("-");
    const arrayOfNumbers = range(
      Number(splitOptions[0]),
      Number(splitOptions[1]),
      1
    );
    const selectedOptions = CRON_OPTIONS_MAP[index].filter((item) =>
      arrayOfNumbers.includes(item.value)
    );
    const selectedOptionsValues = selectedOptions.map((option) => option.value);
    const cronStringForField = groupConsecutiveNumbers(selectedOptionsValues);

    return {
      selectedOptions,
      cronStringForField,
    };
  };

  const handleCronInput = (value, index) => {
    const selectedOptions = CRON_OPTIONS_MAP[index].filter(
      (option) => option.value === Number(value)
    );

    return selectedOptions;
  };

  const handleCronInputBlur = (cronInputValue) => {
    const isValidCronValue = validateCronInput(cronInputValue);

    console.log("isValidCronValue", isValidCronValue);

    if (!isValidCronValue) {
      setErrors({
        ...errors,
        cronString:
          invalidCronStringErrorMessage || "Crontab String is Invalid",
      });
      return;
    }

    setErrors({
      ...errors,
      cronString: undefined,
    });

    const cronInputArray = cronInputValue.split(" ");
    let newPeriod = { value: "minute", label: "Minute" };

    cronInputArray.forEach((item, index) => {
      let selectedOptionsForField = [];
      let cronStringValue = "";
      if (item.includes(",")) {
        const itemArr = item.split(",");

        itemArr.forEach((option) => {
          if (option.includes("-")) {
            const { selectedOptions, cronStringForField } =
              handleCronInputHyphenRange(option, index);
            selectedOptionsForField = [
              ...selectedOptionsForField,
              ...selectedOptions,
            ];
            cronStringValue = cronStringValue
              ? `${cronStringValue},${cronStringForField}`
              : cronStringForField;
          } else {
            if (option === "*" || !Number(option)) {
              return;
            }
            const selectedOptions = handleCronInput(option, index);
            selectedOptionsForField = [
              ...selectedOptionsForField,
              ...selectedOptions,
            ];
            cronStringValue = cronStringValue
              ? `${cronStringValue},${option}`
              : option;
          }
        });
      } else if (item.includes("-")) {
        const { selectedOptions, cronStringForField } =
          handleCronInputHyphenRange(item, index);
        selectedOptionsForField = [
          ...selectedOptionsForField,
          ...selectedOptions,
        ];
        cronStringValue = cronStringValue
          ? `${cronStringValue},${cronStringForField}`
          : cronStringForField;
      } else if (item === "*") {
        selectedOptionsForField = [...selectedOptionsForField, ...[]];
        cronStringValue = "*";
      } else {
        if (Number(item) || Number(item) === 0) {
          const selectedOptions = handleCronInput(item, index);
          selectedOptionsForField = [
            ...selectedOptionsForField,
            ...selectedOptions,
          ];
          cronStringValue = cronStringValue
            ? `${cronStringValue},${item}`
            : item;
        } else {
          return;
        }
      }

      setSelectedValues((prevState) => ({
        ...prevState,
        [CRON_VALUE_MAP[index]]: selectedOptionsForField,
      }));

      setCronValue((prevState) => ({
        ...prevState,
        [CRON_VALUE_MAP[index]]: cronStringValue,
      }));
    });

    if (cronInputArray[3] !== "*") {
      newPeriod = { value: "year", label: "Year" };
    } else if (cronInputArray[2] !== "*") {
      newPeriod = { value: "month", label: "Month" };
    } else if (cronInputArray[4] !== "*") {
      newPeriod = { value: "week", label: "Week" };
    } else if (cronInputArray[1] !== "*") {
      newPeriod = { value: "day", label: "Day" };
    } else if (cronInputArray[0] !== "*") {
      newPeriod = { value: "hour", label: "Hour" };
    }

    setPeriod(newPeriod);
  };

  const handlePeriodChange = (e) => {
    setPeriod(e);
    if (e.value === "minute") {
      setCronValue(DEFAULT_CRON);
      setSelectedValues(DEFAULT_CRON_SELECTED);
    } else if (e.value === "month") {
      setCronValue((prevState) => ({
        ...prevState,
        months: "*",
      }));
      setSelectedValues((prevState) => ({
        ...prevState,
        months: DEFAULT_CRON_SELECTED.months,
      }));
    } else if (e.value === "week") {
      setCronValue((prevState) => ({
        ...prevState,
        months: "*",
        daysOfTheWeek: "*",
      }));
      setSelectedValues((prevState) => ({
        ...prevState,
        months: DEFAULT_CRON_SELECTED.months,
        daysOfTheWeek: DEFAULT_CRON_SELECTED.daysOfTheWeek,
      }));
    } else if (e.value === "day") {
      setCronValue((prevState) => ({
        ...prevState,
        months: "*",
        daysOfTheWeek: "*",
        daysOfTheMonth: "*",
      }));
      setSelectedValues((prevState) => ({
        ...prevState,
        months: DEFAULT_CRON_SELECTED.months,
        daysOfTheWeek: DEFAULT_CRON_SELECTED.daysOfTheWeek,
        daysOfTheMonth: DEFAULT_CRON_SELECTED.daysOfTheMonth,
      }));
    } else if (e.value === "hour") {
      setCronValue((prevState) => ({
        ...prevState,
        months: "*",
        daysOfTheWeek: "*",
        daysOfTheMonth: "*",
        hours: "*",
      }));
      setSelectedValues((prevState) => ({
        ...prevState,
        months: DEFAULT_CRON_SELECTED.months,
        daysOfTheWeek: DEFAULT_CRON_SELECTED.daysOfTheWeek,
        daysOfTheMonth: DEFAULT_CRON_SELECTED.daysOfTheMonth,
        hours: DEFAULT_CRON_SELECTED.hours,
      }));
    }
  };

  return (
    <div className="cr cr-container">
      <input
        type="text"
        value={cronString}
        className={`cr-container-cron-input ${
          errors.cronString && "cr-has-error"
        }`}
        onChange={(e) => {
          setCronString(e.target.value);
        }}
        onBlur={(e) => handleCronInputBlur(e.target.value)}
        style={{ width: "400px" }}
      />
      {errors.cronString && (
        <span className="cr-error-text">{errors.cronString}</span>
      )}
      <div className="cr-container-field">
        <span>Period</span>
        <Select
          options={periodOptions}
          onChange={handlePeriodChange}
          name="period"
          value={period}
          styles={colorStyles}
          menuShouldScrollIntoView={false}
          className="cr-container-field-period"
        />
      </div>
      {["year"].includes(period.value) && (
        <div className="cr-container-field cr-container-field-month">
          <span>Month</span>
          <Select
            options={monthsOptions}
            onChange={(newValues) => handleChange(newValues, "months")}
            name="months"
            styles={colorStyles}
            isMulti
            delimiter=","
            menuShouldScrollIntoView={false}
            placeholder={<div>Every month</div>}
            cropWithEllipsis
            closeMenuOnSelect={false}
            value={selectedValues.months}
            {...(shortSelectedOptions
              ? { formatOptionLabel: shortFormatOptionLabel }
              : {})}
          />
        </div>
      )}
      {["year", "month"].includes(period.value) && (
        <div className="cr-container-field">
          <span>Days of the Month</span>
          <Select
            options={daysOfTheMonthOptions}
            onChange={(newValues) => handleChange(newValues, "daysOfTheMonth")}
            styles={colorStyles}
            menuShouldScrollIntoView={false}
            isMulti
            name="daysOfTheMonth"
            placeholder={<div>Every day of the month</div>}
            value={selectedValues.daysOfTheMonth}
            closeMenuOnSelect={false}
          />
        </div>
      )}
      {["year", "month", "week"].includes(period.value) && (
        <div className="cr-container-field">
          <span>Days of the Week</span>
          <Select
            options={daysOfTheWeekOptions}
            onChange={(newValues) => handleChange(newValues, "daysOfTheWeek")}
            name="daysOfTheWeek"
            styles={colorStyles}
            menuShouldScrollIntoView={false}
            isMulti
            placeholder={<div>Every day of the week</div>}
            value={selectedValues.daysOfTheWeek}
            closeMenuOnSelect={false}
            {...(shortSelectedOptions
              ? { formatOptionLabel: shortFormatOptionLabel }
              : {})}
          />
        </div>
      )}
      {["year", "month", "week", "day"].includes(period.value) && (
        <div className="cr-container-field">
          <span>Hour</span>
          <Select
            options={hoursOptions}
            onChange={(newValues) => handleChange(newValues, "hours")}
            name="hours"
            styles={colorStyles}
            menuShouldScrollIntoView={false}
            isMulti
            placeholder={<div>Every Hour</div>}
            value={selectedValues.hours}
            closeMenuOnSelect={false}
          />
        </div>
      )}
      {["year", "month", "week", "day", "hour"].includes(period.value) && (
        <div className="cr-container-field">
          <span>Minutes</span>
          <Select
            options={minutesOptions}
            onChange={(newValues) => handleChange(newValues, "minutes")}
            name="minutes"
            styles={colorStyles}
            menuShouldScrollIntoView={false}
            isMulti
            placeholder={<div>Every Minute</div>}
            value={selectedValues.minutes}
            closeMenuOnSelect={false}
          />
        </div>
      )}
    </div>
  );
}

Crontab.propTypes = {
  value: PropTypes.string,
  invalidCronStringErrorMessage: PropTypes.string,
  shortFormatOptionLabel: PropTypes.bool,
};

Crontab.defaultProps = {
  value: "",
  invalidCronStringErrorMessage: "",
  shortFormatOptionLabel: true,
};

export default Crontab;
