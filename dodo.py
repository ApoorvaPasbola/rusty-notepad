def task_start():
    return {
        'actions': ['npm run tauri dev -- -- -- D:\\sublime ']
    }

def task_start_alt_path():
    return {
        'actions': ['npm run tauri dev -- -- -- D:\\Repo ']
    }



def task_build():
    return {
        'actions': ['npm run tauri build']
    }


def task_storybook():
    return {
        'actions': ['npm run storybook']
    }
