import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingContactPanelComponent } from './floating-contact-panel.component';

describe('FloatingContactPanelComponent', () => {
  let component: FloatingContactPanelComponent;
  let fixture: ComponentFixture<FloatingContactPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FloatingContactPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingContactPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
