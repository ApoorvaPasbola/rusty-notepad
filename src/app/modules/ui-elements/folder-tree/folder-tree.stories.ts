import { type Meta, type StoryObj } from '@storybook/angular';
import { FolderTreeComponent } from './folder-tree.component';


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<FolderTreeComponent> = {
  title: 'Example/Folder Tree',
  component: FolderTreeComponent,
  tags: ['autodocs'],
  render: (args: FolderTreeComponent) => ({
    props: {
      ...args,
    },
     template: `<rusty-folder-tree> </rusty-folder-tree>`
  }),

};

export default meta;
type Story = StoryObj<FolderTreeComponent>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
};

