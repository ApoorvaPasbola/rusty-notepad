import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { TabsComponent } from './tabs.component';


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<TabsComponent> = {
  title: 'Example/Tabs',
  component: TabsComponent,
  tags: ['autodocs'],
  render: (args: any) => ({
    props: {
      tabs: args.tabs,
    },
    template: `<app-tabs ${argsToTemplate(args)} ></app-tabs>`,
  }),
};

export default meta;
type Story = StoryObj<TabsComponent>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
};
