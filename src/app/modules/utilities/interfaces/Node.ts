export interface Node {
    name:string,
    nodes?: Node[],
    isDirectory: boolean,
    expanded: boolean
}

export const DEFAULT_NODE: Node =  {
  name: "notes",
  nodes: [],
  isDirectory: false,
  expanded: false
}

export interface FileSystemItem {
    file_name: string,
    is_folder: boolean
}
