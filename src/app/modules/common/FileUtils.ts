import { invoke } from "@tauri-apps/api";

export function readFile(path: string | undefined): Promise<string> {
    // If path is undefined the log a debug message and return the default values
    if (!path) {
      console.debug('Error while opening the file. Path undefined', path);
      return new Promise((_, reject) => reject('Lets write an epic :)'));
    }

    console.debug('Reading file with path ', path);
    /**
     * Reads the content of the file from the given path
     */
    return invoke<string>('read_file', { path });
  }