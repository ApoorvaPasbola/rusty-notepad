use std::{fs, io, path::PathBuf};

pub fn _list_files(vec: &mut Vec<PathBuf>, path: PathBuf) -> io::Result<()>  {
    if path.is_dir() {
        let paths = fs::read_dir(&path)?;
        for path_result in paths {
            let full_path = path_result?.path();
            vec.push(full_path);
        }
    }
    Ok(())
}