import {Component, ElementRef, OnChanges, Renderer2, SimpleChanges, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-workpad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workpad.component.html',
  styleUrl: './workpad.component.scss'
})
export class WorkpadComponent  {

  data:string = "workpad-works";
  constructor(){}
  handleClick(event:any){
    this.data = event.target.innerHTML
    console.log("Current value is ", this.data);
    
  }
  }
