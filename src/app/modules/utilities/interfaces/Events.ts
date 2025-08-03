export interface NotepadEvents {
  file_name?:string,
  path?: string | undefined,
  data?: string
  type: AppEvents
}

export enum AppEvents {
  TAB_CREATE,
  WORKPAD_SAVE_REQUEST,
  APP_OPEN_DIR
}
