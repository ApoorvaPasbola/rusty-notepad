import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorModule } from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import { AutofocusDirective } from '../../directives/autofocus/autofocus.directive';
@Component({
  selector: 'app-workpad',
  standalone: true,
  imports: [CommonModule, EditorModule, FormsModule, AutofocusDirective ],
  templateUrl: './workpad.component.html',
  styleUrl: './workpad.component.scss',
})
export class WorkpadComponent implements OnInit, AfterViewInit, OnChanges {
  /**   
   * Takes input string from tabs . Which reads data from the file
   */
  @Input('contentFromFile') contentFromFile: string | undefined;

  /**
   * Current draft work in progress 
   */
  work: string = '';
  
  showHeader: boolean = false;

  constructor(private el: ElementRef, private cd: ChangeDetectorRef){}

  ngOnChanges(changes: SimpleChanges): void {
    console.log("Workpad changed ", changes);
    this.work = changes['contentFromFile'].currentValue
    // this.cd.detectChanges();
  }

  ngOnInit(): void {
    
    if(this.contentFromFile)
      this.work = this.contentFromFile;
  }

  ngAfterViewInit(): void {
    // // var editorContent: HTMLElement = this.el.nativeElement.children[0].children[0].getElementsByClassName("p-editor-content")[0]
    // var editorContent: HTMLElement = this.el.nativeElement.querySelector(".p-editor-content")
    // editorContent.click()
    // // document.querySelector(".p-editor-content.ql-editor")
    // // var editor = editorContent.
    // console.log("element ", editorContent, editorContent.childNodes);   
  }
}
