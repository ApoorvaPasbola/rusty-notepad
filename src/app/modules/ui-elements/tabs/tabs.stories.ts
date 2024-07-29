import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { TabsComponent } from './tabs.component';
import { action } from '@storybook/addon-actions';

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
  args: {
    tabs : [{
      id: 1,
      selected: true,
      isClosable: true,
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim \
        ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commod consequat. \
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. \
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      title: 'Tab 1',
    },
    {
      id: 2,
      selected: false,
      isClosable: true,
      content:
        'ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commod consequat. \
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. \
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      title: 'Tab 2',
    },
    {
      id: 3,
      selected: false,
      isClosable: false,
      content:
        'ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commod consequat. \
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. \
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      title: 'Tab 3',
    }]
  }
};
