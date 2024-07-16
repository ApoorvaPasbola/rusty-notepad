import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from '@storybook/test';
import { SplitterComponent } from '../../app/modules/ui-elements/splitter/splitter.component';


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<SplitterComponent> = {
  title: 'Example/Splitter',
  component: SplitterComponent,
  tags: ['autodocs'],

  argTypes: {
    backgroundColor: {
      control: 'color',
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
};

export default meta;
type Story = StoryObj<SplitterComponent>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
  render: (args) => ({
    // template: `<> This is Basic Horizontal Bar </app-horizontal-bar>`
  })
};