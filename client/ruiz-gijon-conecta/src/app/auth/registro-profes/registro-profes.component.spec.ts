import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroProfesComponent } from './registro-profes.component';

describe('RegistroProfesComponent', () => {
  let component: RegistroProfesComponent;
  let fixture: ComponentFixture<RegistroProfesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistroProfesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroProfesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
