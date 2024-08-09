export interface Node {
  name: string,
  nodes?: Node[],
  isDirectory: boolean,
  expanded: boolean,
  parentNodeName: string
}

export const DEFAULT_NODE: Node = {
  name: "notes",
  nodes: [],
  isDirectory: false,
  expanded: false,
  parentNodeName: "."
}

export function mapFileSystemItem2Node(fileSystemItem: FileSystemItem, parent_node?: string): Node {
  return { ...DEFAULT_NODE, name: fileSystemItem.file_name, isDirectory: fileSystemItem.is_folder, parentNodeName: parent_node } as Node;
}
export function mapFileSystemItem2NodeList(fileSystemItem: FileSystemItem[], parent_node?: string): Node[] {
  return fileSystemItem
    .map((item) => mapFileSystemItem2Node(item, parent_node))
    .sort((a, b) => a.name.localeCompare(b.name)).sort((a, b) => Number(b.isDirectory) - Number(a.isDirectory));;
}

export interface FileSystemItem {
  file_name: string,
  is_folder: boolean
}
