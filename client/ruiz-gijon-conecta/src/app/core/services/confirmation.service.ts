import { Injectable, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  private modalRef: NgbModalRef | null = null;
  private resolveFn: ((confirmed: boolean) => void) | null = null;

  constructor(private modalService: NgbModal) {}

  open(template: TemplateRef<any>, title: string, message: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.resolveFn = resolve;

      // guardamos modalRef para cerrarlo desde fuera
      this.modalRef = this.modalService.open(template, {
        centered: true,
        backdrop: 'static',
        keyboard: false,
      });

      
    });
  }

  confirm(): void {
    this.resolveFn?.(true);
    this.modalRef?.close();
    this.reset();
  }

  cancel(): void {
    this.resolveFn?.(false);
    this.modalRef?.dismiss();
    this.reset();
  }

  private reset() {
    this.modalRef = null;
    this.resolveFn = null;
  }
}
