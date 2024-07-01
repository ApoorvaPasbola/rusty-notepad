import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[workpadResizer]',
  standalone: true
})
export class ResizerDirective {

  @HostListener("input") onTextChange(){
    this.resize(this.el.nativeElement);
  }

  constructor(private el: ElementRef) { }

  resize(textArea: HTMLTextAreaElement) {
    textArea.style.height = 'auto'
    textArea.style.height = (textArea.scrollHeight) + 'px';
}

}
