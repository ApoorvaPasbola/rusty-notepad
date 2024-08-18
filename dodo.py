def task_start():
    return {
        'actions': ['npm run tauri dev -- -- -- D:\\sublime ']
    }


def task_build():
    return {
        'actions': ['npm run tauri build']
    }

def task_dev_build():
    return {
        'actions': ['npm run tauri build --debug']
    }

def task_storybook():
    return {
        'actions': ['npm run storybook']
    }
