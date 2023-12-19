import Crontab from "../Crontab";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: "Example/Crontab",
  component: Crontab,
  tags: ["autodocs"],
  argTypes: {
    shortSelectedOptions: { control: "boolean" },
    invalidCronStringErrorMessage: { control: "text" },
    value: { control: "text" },
    onChange: {
      action: "changed value",
      argsType: "function", // This line specifies that onClick is a function
    },
  },
};

export const Default = {
  args: {},
};

export const PreSelectedValue = {
  args: {
    value: "1-6 1-6 1-3 1-2,7 1,6",
  },
};

export const ShowLongName = {
  args: {
    shortSelectedOptions: false,
    value: "* * * 1-2 2-4",
  },
};

export const InvalidErrorMessage = {
  args: {
    invalidCronStringErrorMessage: "Oops. Invalid cron string",
    value: "aaaa",
  },
};
