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

export function mapFileSystemItem2Node(fileSystemItem:FileSystemItem):Node {
  return { ...DEFAULT_NODE, name: fileSystemItem.file_name, isDirectory: fileSystemItem.is_folder } as Node ;
}
export function mapFileSystemItem2NodeList(fileSystemItem: FileSystemItem[]):Node[] {
  return fileSystemItem
          .map((item)=> mapFileSystemItem2Node(item))
          .sort((a, b) => a.name.localeCompare(b.name)).sort((a, b) => Number(b.isDirectory) - Number(a.isDirectory));;
}

export interface FileSystemItem {
    file_name: string,
    is_folder: boolean
}
