import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkpadComponent } from './workpad.component';

describe('WorkpadComponent', () => {
  let component: WorkpadComponent;
  let fixture: ComponentFixture<WorkpadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkpadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkpadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
