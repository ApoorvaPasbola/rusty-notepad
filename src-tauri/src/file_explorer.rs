use std::{fs, io, path::PathBuf};

pub fn _list_files(vec: &mut Vec<String>, path: PathBuf) -> io::Result<()>  {
    if path.is_dir() {
        let paths = fs::read_dir(&path)?;
        for path_result in paths {
            let full_path = path_result?.file_name().into_string();
            vec.push(full_path.unwrap_or(String::from("ERROR: Undefined")));
        }
    }
    Ok(())
}