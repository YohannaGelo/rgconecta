import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoVerificadoComponent } from './no-verificado.component';

describe('NoVerificadoComponent', () => {
  let component: NoVerificadoComponent;
  let fixture: ComponentFixture<NoVerificadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoVerificadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoVerificadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
