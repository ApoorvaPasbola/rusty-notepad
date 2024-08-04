import { Component } from '@angular/core';
import { invoke } from '@tauri-apps/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  listDirectory(event: any): void {
    event.preventDefault();
    let path = "D:\\OpenSourceSoftware\\rusty-notepad\\src\\app"
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    invoke<string>("read_directory", { path }).then((paths: any) => {
      console.log("This is response form file_explorer ", paths );
      
    });
  }
}
