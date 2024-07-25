import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[rustyAutofocus]',
  standalone: true,
})
export class AutofocusDirective implements AfterViewInit {
  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    console.log("This got called ");
    
    this.elementRef.nativeElement.focus();
  }
}
