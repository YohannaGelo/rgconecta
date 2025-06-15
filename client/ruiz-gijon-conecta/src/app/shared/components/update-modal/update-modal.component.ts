import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VersionService } from '../../../core/services/version.service';

@Component({
  selector: 'app-update-modal',
  standalone: false,
  templateUrl: './update-modal.component.html',
  styleUrl: './update-modal.component.scss',
})
export class UpdateModalComponent {
  @Input() commitHash: string = '';
  @Input() buildDate: string = '';

  mostrarCambios = false;
  @Input() commitMessage: string = '';

  constructor(
    public modal: NgbActiveModal,
    private versionService: VersionService
  ) {}

  ngOnInit(): void {
    this.commitMessage = this.versionService.getCommitMessage();
  }

  get commitLink(): string {
    return `https://github.com/YohannaGelo/rgconecta/commit/${this.commitHash}`;
  }

  get commitMessageFormatted(): string {
    // Añade salto de línea después de cada punto + espacio
    return this.commitMessage.replace(/\. /g, '.\n');
  }

  reload() {
    window.location.reload();
  }
}
