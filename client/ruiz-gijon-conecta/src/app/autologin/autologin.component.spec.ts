import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutologinComponent } from './autologin.component';

describe('AutologinComponent', () => {
  let component: AutologinComponent;
  let fixture: ComponentFixture<AutologinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutologinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutologinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
