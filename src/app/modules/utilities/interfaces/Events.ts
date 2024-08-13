export interface FileEvents {
  file_name?:string,
  path?: string | undefined,
  data?: string
  type: FileEventType
}

export enum FileEventType {
  OPEN,
  SAVE,
  TAB_CHANGE,
}
