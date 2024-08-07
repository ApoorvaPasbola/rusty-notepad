use serde::{Deserialize, Serialize};
use std::{fs, io, path::PathBuf};

#[derive(Serialize, Deserialize, Debug)]
pub struct SystemObject {
    file_name: String,
    is_folder: bool,
}

pub fn _list_files(vec: &mut Vec<SystemObject>, path: PathBuf) -> io::Result<()> {
    print!("Received working directory as {:?}", path);
    if path.is_dir() {
        let paths = fs::read_dir(&path)?;
        for path_result in paths {
            let entry = &path_result?;
            let node = SystemObject {
                file_name: String::from(entry.file_name().into_string().unwrap()),
                is_folder: entry.file_type()?.is_dir(),
            };
            vec.push(node);
        }

        vec.push(SystemObject {
            file_name: path
                .file_name()
                .unwrap()
                .to_str()
                .unwrap_or(&String::from("workpad"))
                .to_string(),
            is_folder: path.is_dir(),
        });
    }
    Ok(())
}
