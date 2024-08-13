export interface OpenFileEvent {
  file_name: string;
  path: string;
}

export interface SaveFileEvent {
     path?: string,
     data?: string
}

export interface TabChangeEvent {
  path: string | undefined,
  file: string
}

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
