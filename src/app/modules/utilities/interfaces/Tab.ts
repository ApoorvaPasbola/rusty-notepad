export interface Tab {
  id: number,
  title: string,
  isClosable: boolean,
  selected: boolean,
  path: string,
  isSaved?: boolean,
  isNewTab:boolean
}


export interface DraftNotes {
  draftId:number
  tab: Tab,
  content: string,
}