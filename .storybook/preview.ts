import type { Preview } from '@storybook/angular';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';
import { themes } from '@storybook/theming';
setCompodocJson(docJson);

const preview: Preview = {
  parameters: {
    darkMode: {
      current: 'dark',
      dark : { ...themes, appBg: 'black'},
      light: { ...themes.normal, appBg: 'red' }
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
