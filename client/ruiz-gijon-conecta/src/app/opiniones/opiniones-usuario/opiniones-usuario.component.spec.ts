import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpinionesUsuarioComponent } from './opiniones-usuario.component';

describe('OpinionesUsuarioComponent', () => {
  let component: OpinionesUsuarioComponent;
  let fixture: ComponentFixture<OpinionesUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpinionesUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpinionesUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
