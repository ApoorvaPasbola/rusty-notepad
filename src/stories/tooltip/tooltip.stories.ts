import type { Meta, StoryObj } from '@storybook/angular';
import { TooltipComponent } from '../../app/modules/ui-elements/tooltip/tooltip.component';


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<TooltipComponent> = {
  title: 'Example/Tooltip',
  component: TooltipComponent,
  tags: ['autodocs'],

};

export default meta;
type Story = StoryObj<TooltipComponent>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
  render: (args) => ({
    template: ``
  })
};
