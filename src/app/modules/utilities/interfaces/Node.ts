export interface Node {
    name:string,
    nodes?: Node[],
    isDirectory?: boolean
}

export interface FileSystemItem {
    file_name: string,
    is_folder: boolean
}