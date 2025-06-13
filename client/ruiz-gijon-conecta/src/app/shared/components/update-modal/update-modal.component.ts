import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-update-modal',
  standalone: false,
  templateUrl: './update-modal.component.html',
  styleUrl: './update-modal.component.scss',
})
export class UpdateModalComponent {
  @Input() commitHash: string = '';
  @Input() buildDate: string = '';

  constructor(public modal: NgbActiveModal) {}

  get commitLink(): string {

    return `https://github.com/YohannaGelo/rgconecta/commit/${this.commitHash}`;
  }

  reload() {
    window.location.reload();
  }
}
