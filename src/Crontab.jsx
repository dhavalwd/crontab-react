import { useEffect, useState } from "react";
import "./App.css";
import Select from "react-select";
import { groupConsecutiveNumbers, range } from "./utils";
import { CRON_STRING_REGEX } from "./constants";

const DEFAULT_CRON = {
  minutes: "*",
  hours: "*",
  months: "*",
  daysOfTheMonth: "*",
  daysOfTheWeek: "*",
};

const DEFAULT_CRON_SELECTED = {
  minutes: [],
  hours: [],
  months: [],
  daysOfTheMonth: [],
  daysOfTheWeek: [],
};

function Crontab(props) {
  const { disableYear = false } = props;
  const [period, setPeriod] = useState({ value: "year", label: "Year" });
  const [cronValue, setCronValue] = useState(DEFAULT_CRON);
  const [cronString, setCronString] = useState("* * * * *");
  const [selectedMinutes, setSelectedMinutes] = useState("");
  const [selectedHours, setSelectedHours] = useState("");
  const [selectedDaysOfTheMonth, setSelectedDaysOfTheMonth] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDaysOfTheWeek, setSelectedDaysOfTheWeek] = useState("");

  const [selectedValues, setSelectedValues] = useState(DEFAULT_CRON_SELECTED);

  useEffect(() => {
    setCronString(
      `${cronValue.minutes} ${cronValue.hours} ${cronValue.daysOfTheMonth} ${cronValue.months} ${cronValue.daysOfTheWeek}`
    );
  }, [cronValue]);

  console.log("disableYear", disableYear);

  const options = [
    { value: "year", label: "Year" },
    { value: "month", label: "Month" },
    { value: "week", label: "Week" },
    { value: "day", label: "Day" },
    { value: "hour", label: "Hour" },
    { value: "minute", label: "Minute" },
  ];

  const monthOptions = [
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

  const dateOptions = new Array(32).fill(1, 1).map((_, i) => {
    return { value: i, label: i.toString() };
  });

  const dayOfWeekOptions = [
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
    { value: 7, label: "Sunday" },
  ];

  const hourOptions = new Array(24).fill(1).map((_, i) => {
    return { value: i, label: i.toString() };
  });

  const minuteOptions = new Array(60).fill(1).map((_, i) => {
    return { value: i, label: i.toString() };
  });

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
          ? "grey"
          : isFocused
          ? "grey"
          : undefined,
        color: isDisabled ? "#ccc" : isSelected ? "white" : "black",
        cursor: isDisabled ? "not-allowed" : "default",

        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled
            ? isSelected
              ? "blue"
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

  const handleChange = (newSelectedValues, name) => {
    console.log("newSelectedValues", newSelectedValues);
    if (newSelectedValues.length > 0) {
      const sortedValues = [...newSelectedValues].sort(
        (a, b) => a.value - b.value
      );
      console.log("sortedValues", sortedValues);

      const onlyValues = sortedValues.map((item) => item.value);

      const cronString = groupConsecutiveNumbers(onlyValues);

      setSelectedValues((prevState) => ({
        ...prevState,
        [name]: newSelectedValues,
      }));

      setCronValue({
        ...cronValue,
        [name]: cronString,
      });
    } else {
      setCronValue({
        ...cronValue,
        [name]: "*",
      });
    }
  };

  const handleCronInputChange = (e) => {
    const value = e.target.value;
    const spacedArr = value.split(" ");
    let valid = true;

    // setCronValue(value);

    console.log("spacedArr", spacedArr);

    if (spacedArr.length !== 5) {
      console.log("invalid value space");
      return;
    }

    spacedArr.map((item, index) => {
      console.log("index", index);
      if (!CRON_STRING_REGEX.test(item)) {
        console.log("invalid value");
        valid = false;
        return;
      }

      // Valid format
      if (item.includes(",")) {
        const splitTest = item.split(",");
        console.log("splitTest", splitTest);

        splitTest.map((item) => {
          if (item.includes("-")) {
            const splitItem = item.split("-");

            if (splitItem[0] >= splitItem[1]) {
              console.log("invalid hyphen value");
              valid = false;
              return;
            }
          }
        });
      } else if (item.includes("-")) {
        const splitTest = item.split("-");
        console.log("splitTest", splitTest);

        console.log("splitTest[0]", splitTest[0]);
        console.log("splitTest[1]", splitTest[1]);

        if (splitTest[0] >= splitTest[1]) {
          console.log("invalid hyphen value");
          valid = false;
          return;
        }

        const arrayOfNumbers = range(
          Number(splitTest[0]),
          Number(splitTest[1]),
          1
        );

        console.log("arrayOfNumbers", arrayOfNumbers);

        if (index === 0) {
          const name = "minutes";
          const selectedItem = minuteOptions.filter((item) =>
            arrayOfNumbers.includes(item.value)
          );
          console.log("selectedItem", selectedItem);
          setSelectedValues((prevState) => ({
            ...prevState,
            [name]: selectedItem,
          }));
        } else if (index === 1) {
          const name = "hours";
          const selectedItem = hourOptions.filter((item) =>
            arrayOfNumbers.includes(item.value)
          );
          console.log("selectedItem", selectedItem);
          // setSelectedHours(selectedItem);
          setSelectedValues((prevState) => ({
            ...prevState,
            [name]: selectedItem,
          }));
        } else if (index === 2) {
          const name = "daysOfTheMonth";
          const selectedItem = dateOptions.filter((item) =>
            arrayOfNumbers.includes(item.value)
          );
          console.log("selectedItem", selectedItem);
          // setSelectedDaysOfTheMonth(selectedItem);
          setSelectedValues((prevState) => ({
            ...prevState,
            [name]: selectedItem,
          }));
        } else if (index === 3) {
          const name = "months";
          const selectedItem = monthOptions.filter((item) =>
            arrayOfNumbers.includes(item.value)
          );
          console.log("selectedItem", selectedItem);
          // setSelectedMonth(selectedItem);
          setSelectedValues((prevState) => ({
            ...prevState,
            [name]: selectedItem,
          }));
        } else if (index === 4) {
          const name = "daysOfTheWeek";
          const selectedItem = dayOfWeekOptions.filter((item) =>
            arrayOfNumbers.includes(item.value)
          );
          console.log("selectedItem", selectedItem);
          // setSelectedDaysOfTheWeek(selectedItem);
          setSelectedValues((prevState) => ({
            ...prevState,
            [name]: selectedItem,
          }));
        }
      }
    });

    if (!valid) {
      return;
    } else {
      console.log("value", value);
    }
  };

  return (
    <div className="cr cr-container">
      <input
        type="text"
        value={cronString}
        className="cr-container-cron-input"
        onChange={(e) => setCronString(e.target.value)}
        onBlur={handleCronInputChange}
      />
      <div className="cr-container-field">
        <span>Period</span>
        <Select
          options={options}
          onChange={(e) => {
            setPeriod(e);
            if (e.value === "minute") {
              setCronValue(DEFAULT_CRON);
            }
          }}
          name="period"
          value={period}
          styles={colorStyles}
          menuShouldScrollIntoView={false}
        />
      </div>
      {["year"].includes(period.value) && (
        <div className="cr-container-field cr-container-field-month">
          <span>Month</span>
          <Select
            options={monthOptions}
            onChange={(newValues) => handleChange(newValues, "months")}
            name="months"
            styles={colorStyles}
            isMulti
            delimiter=","
            menuShouldScrollIntoView={false}
            placeholder={<div>Every month</div>}
            cropWithEllipsis
            formatOptionLabel={shortFormatOptionLabel}
            value={selectedValues.months}
          />
        </div>
      )}
      {["year", "month"].includes(period.value) && (
        <div className="cr-container-field">
          <span>Days of the Month</span>
          <Select
            options={dateOptions}
            onChange={(newValues) => handleChange(newValues, "daysOfTheMonth")}
            styles={colorStyles}
            menuShouldScrollIntoView={false}
            isMulti
            name="daysOfTheMonth"
            placeholder={<div>Every day of the month</div>}
            value={selectedValues.daysOfTheMonth}
          />
        </div>
      )}
      {["year", "month", "week"].includes(period.value) && (
        <div className="cr-container-field">
          <span>Days of the Week</span>
          <Select
            options={dayOfWeekOptions}
            onChange={(newValues) => handleChange(newValues, "daysOfTheWeek")}
            name="daysOfTheWeek"
            styles={colorStyles}
            menuShouldScrollIntoView={false}
            isMulti
            placeholder={<div>Every day of the week</div>}
            formatOptionLabel={shortFormatOptionLabel}
            value={selectedValues.daysOfTheWeek}
          />
        </div>
      )}
      {["year", "month", "week", "day"].includes(period.value) && (
        <div className="cr-container-field">
          <span>Hour</span>
          <Select
            options={hourOptions}
            onChange={(newValues) => handleChange(newValues, "hours")}
            name="hours"
            styles={colorStyles}
            menuShouldScrollIntoView={false}
            isMulti
            placeholder={<div>Every Hour</div>}
            value={selectedValues.hours}
          />
        </div>
      )}
      {["year", "month", "week", "day", "hour"].includes(period.value) && (
        <div className="cr-container-field">
          <span>Minutes</span>
          <Select
            options={minuteOptions}
            onChange={(newValues) => handleChange(newValues, "minutes")}
            name="minutes"
            styles={colorStyles}
            menuShouldScrollIntoView={false}
            isMulti
            placeholder={<div>Every Minute</div>}
            value={selectedValues.minutes}
          />
        </div>
      )}
    </div>
  );
}

export default Crontab;
