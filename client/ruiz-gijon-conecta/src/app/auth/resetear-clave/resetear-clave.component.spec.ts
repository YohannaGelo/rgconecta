import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetearClaveComponent } from './resetear-clave.component';

describe('ResetearClaveComponent', () => {
  let component: ResetearClaveComponent;
  let fixture: ComponentFixture<ResetearClaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResetearClaveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetearClaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
