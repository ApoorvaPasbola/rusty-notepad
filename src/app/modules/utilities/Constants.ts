import { Tab} from "./interfaces/Tab";

export const NEW_TAB_DEFAULT: Tab = {
id: -1,
isClosable: true,
selected: true,
title: "New Tab",
path: "",
isNewTab: true,
isSaved: false
}

export const APP_COMMANDS = [
    {
      discription: "New Tab",
      keys: { key: 'Ctrl', alpha: 'N' }
    },
    {
      discription: "Close Tab",
      keys: { key: 'Ctrl', alpha: 'W' }
    },
    {
      discription: "Open Directory",
      keys: { key: 'Ctrl', alpha: 'O' }
    }
  ]
