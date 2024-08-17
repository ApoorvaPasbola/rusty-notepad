export interface NotepadEvents {
  file_name?:string,
  path?: string | undefined,
  data?: string
  type: AppEvents
}

export enum AppEvents {
  TAB_CHANGE,
  TAB_CREATE,
  TAB_DELETE,
  TABS_EMPTY,
  WORKPAD_UPDATE,
  WORKPAD_SAVE_REQUEST,
  WORKPAD_SAVE_RESPONSE,
  FILE_SYSTEM_OPEN,
  FILE_SYSTEM_READ
}
