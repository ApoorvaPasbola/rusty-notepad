export interface OpenFileEvent {
  file_name: string;
  path: string;
}

export interface SaveFileEvent {
     path?: string,
     data?: string
}