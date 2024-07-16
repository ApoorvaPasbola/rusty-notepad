import type { Meta, StoryObj } from '@storybook/angular';

import { WorkpadComponent } from '../../app/modules/ui-elements/workpad/workpad.component';


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<WorkpadComponent> = {
  title: 'Example/Workpad',
  component: WorkpadComponent,
  tags: ['autodocs'],

};

export default meta;
type Story = StoryObj<WorkpadComponent>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
  render: (args) => ({
    template: `<app-workpad></app-workpad>`
  })
};
