import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesoresVistaComponent } from './profesores-vista.component';

describe('ProfesoresVistaComponent', () => {
  let component: ProfesoresVistaComponent;
  let fixture: ComponentFixture<ProfesoresVistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfesoresVistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfesoresVistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
