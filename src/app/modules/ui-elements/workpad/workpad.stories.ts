import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { WorkpadComponent } from './workpad.component';


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<WorkpadComponent> = {
  title: 'Example/Workpad',
  component: WorkpadComponent,
  tags: ['autodocs'],
  render: (args: WorkpadComponent) => ({
    props: {
      ...args,
    },
    template: `<app-workpad ${argsToTemplate(args)} ></app-workpad>`,
  }),
};

export default meta;
type Story = StoryObj<WorkpadComponent>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
};

export const WorkpadWithContent: Story = {
  args:{
    contentFromFile: "This comes from file"
  },

};

export const WorkpadWithMultipleLinesContent: Story = {
  args:{
    contentFromFile: "Content Lines 1 \n This belonds in another line \n this is third line of content\n <h1>Header</h1>"
  },
};