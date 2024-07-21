import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { RustyViewComponent } from './rusty-view.component';


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<RustyViewComponent> = {
  title: 'Example/RustyView',
  component: RustyViewComponent,
  tags: ['autodocs'],
  render: (args: RustyViewComponent) => ({
    props: {
      ...args,
    },
    template: `<app-rusty-view ${argsToTemplate(args)} ></app-rusty-view>`,
  }),
};

export default meta;
type Story = StoryObj<RustyViewComponent>;


export const Basic: Story = {
};
