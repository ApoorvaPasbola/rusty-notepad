import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from '@storybook/test';
import { HorizontalBarComponent } from '../../app/modules/ui-elements/horizontal-bar/horizontal-bar.component';


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<HorizontalBarComponent> = {
  title: 'Example/Horizontal Bar',
  component: HorizontalBarComponent,
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
type Story = StoryObj<HorizontalBarComponent>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
  render: (args) => ({
    template: `<app-horizontal-bar> This is Basic Horizontal Bar </app-horizontal-bar>`
  })
};

export const HTMLIncludedBar: Story = {
  render: (args) => ({
    template: `<app-horizontal-bar>
      <button class="m-1">Button 1</button>
      <button class="m-1">Button 2</button>
    </app-horizontal-bar>`
  })
};
