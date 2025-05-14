import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificarAlumnosComponent } from './verificar-alumnos.component';

describe('VerificarAlumnosComponent', () => {
  let component: VerificarAlumnosComponent;
  let fixture: ComponentFixture<VerificarAlumnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerificarAlumnosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificarAlumnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
