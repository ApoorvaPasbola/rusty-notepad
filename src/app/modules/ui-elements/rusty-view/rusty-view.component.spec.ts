import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RustyViewComponent } from './rusty-view.component';

describe('RustyViewComponent', () => {
  let component: RustyViewComponent;
  let fixture: ComponentFixture<RustyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RustyViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RustyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
