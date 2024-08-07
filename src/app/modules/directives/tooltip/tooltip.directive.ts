import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Directive, ElementRef, EmbeddedViewRef, HostListener, Injector, Input } from '@angular/core';
import { TooltipComponent } from '../../ui-elements/tooltip/tooltip.component';

@Directive({
  selector: '[tooltip]',
  standalone: true
})
export class TooltipDirective {

  @Input() tooltip:string = '';

  private componentRef: ComponentRef<any> | null = null;

  constructor(
	private elementRef: ElementRef,
	private appRef: ApplicationRef,
	private componentFactoryResolver: ComponentFactoryResolver,
	private injector: Injector) {
  }
//  TODO -> good idea -> making the tooltip open on mousehover on text when we have some selected items 
  @HostListener('contextmenu')
  onMouseEnter(): void {
    if (this.componentRef === null) {
        const componentFactory =
              this.componentFactoryResolver.resolveComponentFactory(
              TooltipComponent);
        this.componentRef = componentFactory.create(this.injector);
        this.appRef.attachView(this.componentRef.hostView);
        const domElem =
              (this.componentRef.hostView as EmbeddedViewRef<any>)
              .rootNodes[0] as HTMLElement;
        document.body.appendChild(domElem);
        this.setTooltipComponentProperties();
    }
  }

  private setTooltipComponentProperties() {
    if (this.componentRef !== null) {
      this.componentRef.instance.tooltip = this.tooltip;
      const {left, right, bottom} =
            this.elementRef.nativeElement.getBoundingClientRect();
      this.componentRef.instance.left = (right - left) / 2 + left;
      this.componentRef.instance.top = bottom;
    }
  }

  @HostListener('click')
  onMouseLeave(): void {
    this.destroy();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  destroy(): void {
    if (this.componentRef !== null) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

}
