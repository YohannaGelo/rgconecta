import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertasUsuarioComponent } from './ofertas-usuario.component';

describe('OfertasUsuarioComponent', () => {
  let component: OfertasUsuarioComponent;
  let fixture: ComponentFixture<OfertasUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfertasUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfertasUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
