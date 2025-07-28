export interface NotepadEvents {
  file_name?:string,
  path?: string | undefined,
  data?: string
  type: AppEvents
}

export enum AppEvents {
  TAB_CREATE,
  TAB_TITLE_CHANGE,
  WORKPAD_UPDATE,
  WORKPAD_SAVE_REQUEST,
  WORKPAD_SAVE_RESPONSE,
  APP_OPEN_DIR
}
