import { Component, computed } from '@angular/core';
import { ExplorerService } from './explorer.service';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'rusty-explorer',
  standalone: true,
  imports: [NgFor],
  templateUrl: './explorer.component.html',
  styleUrl: './explorer.component.scss'
})
export class ExplorerComponent {

  paths = computed(() => {
    return this.fs_service.currentDirectories();
  })

  constructor(private fs_service: ExplorerService ){
    this.fs_service.listDirectory();
  }

}