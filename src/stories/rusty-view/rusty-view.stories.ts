import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from '@storybook/test';
import { RustyViewComponent } from '../../app/modules/ui-elements/rusty-view/rusty-view.component';


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<RustyViewComponent> = {
  title: 'Example/RustyView',
  component: RustyViewComponent,
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
type Story = StoryObj<RustyViewComponent>;


export const Basic: Story = {
  render: (args) => ({
    template: `<app-rusty-view>
    </app-rusty-view>`
  })
};
