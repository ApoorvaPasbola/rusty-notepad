DOIT_CONFIG = {'default_tasks': ['start']}

def task_start():
    return {
        'actions': ['npm run tauri dev']
    }


def task_build():
    return {
        'actions': ['npm run tauri build']
    }
