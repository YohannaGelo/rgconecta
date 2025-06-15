import { Component, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ABOUT_INFO } from '../../../../environments/enviroment.about';
import { VersionService } from '../../../core/services/version.service';

@Component({
  selector: 'app-about-modal',
  standalone: false,
  templateUrl: './about-modal.component.html',
  styleUrl: './about-modal.component.scss',
})
export class AboutModalComponent {
  version = '';
  commit = '';
  build = '';
  info = ABOUT_INFO;

  mostrarCambios = false;
  @Input() commitHash: string = '';
  @Input() commitMessage: string = '';

  constructor(
    public activeModal: NgbActiveModal,
    private versionService: VersionService
  ) {}

  ngOnInit(): void {
    this.commit = this.versionService.getHash();
    this.commitMessage = this.versionService.getCommitMessage();
    this.build = this.versionService.getBuildDate();
  }

  get commitLink(): string {
    return `https://github.com/YohannaGelo/rgconecta/commit/${this.commit}`;
  }

  close() {
    this.activeModal.close();
  }
}
