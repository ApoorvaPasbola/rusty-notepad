import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { HorizontalBarComponent } from './horizontal-bar.component';


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<HorizontalBarComponent> = {
  title: 'Example/Horizontal Bar',
  component: HorizontalBarComponent,
  tags: ['autodocs'],
  render: (args: HorizontalBarComponent) => ({
    props: {
      ...args,
    },
     template: `<app-horizontal-bar> This is Basic Horizontal Bar </app-horizontal-bar>`
  }),

};

export default meta;
type Story = StoryObj<HorizontalBarComponent>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
};

export const HTMLIncludedBar: Story = {
  render: (args) => ({
    template: `<app-horizontal-bar>
      <button class="m-1">Button 1</button>
      <button class="m-1">Button 2</button>
    </app-horizontal-bar>`
  })
};
