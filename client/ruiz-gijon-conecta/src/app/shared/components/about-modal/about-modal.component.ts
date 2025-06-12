import { Component, ViewChild } from '@angular/core';
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

  constructor(
    public activeModal: NgbActiveModal,
    private versionService: VersionService
  ) {}

  ngOnInit(): void {
    this.commit = this.versionService.getHash();
    this.build = this.versionService.getBuildDate();
  }

  close() {
    this.activeModal.close();
  }
}
