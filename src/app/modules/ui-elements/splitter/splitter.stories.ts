import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { SplitterComponent } from './splitter.component';


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<SplitterComponent> = {
  title: 'Example/Splitter',
  component: SplitterComponent,
  tags: ['autodocs'],
  render: (args: SplitterComponent) => ({
    props: {
      ...args,
    },
    template: `<app-splitter [style]="{ height: '500px' }"></app-splitter>`,
  }),

};

export default meta;
type Story = StoryObj<SplitterComponent>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
};

export const WithComponents: Story = {
  render: (args: SplitterComponent) =>({
    template: `
      <app-splitter [style]="{ height: '500px' }">
      <div >Pane1</div>
      <div panel2>Pane2</div>
      </app-splitter>
    `
  })
}
