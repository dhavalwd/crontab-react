import Crontab from "../Crontab";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: "Example/Crontab",
  component: Crontab,
  tags: ["autodocs"],
};

export const ShowLongName = {
  args: {
    shortSelectedOptions: false,
  },
};
