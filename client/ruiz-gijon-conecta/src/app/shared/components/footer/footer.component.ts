import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AboutModalComponent } from '../about-modal/about-modal.component';
import { ABOUT_INFO } from '../../../../environments/enviroment.about';
import { UpdateModalComponent } from '../update-modal/update-modal.component';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  info = ABOUT_INFO;

  constructor(private modalService: NgbModal) {}

  openAboutModal() {
    this.modalService.open(AboutModalComponent, { centered: true });
  }

  // openUpdateModalManualmente() {
  //   const modalRef = this.modalService.open(UpdateModalComponent, {
  //     centered: true,
  //     backdrop: 'static',
  //   });

  //   modalRef.componentInstance.commitHash = 'prueba123';
  //   modalRef.componentInstance.buildDate = new Date().toISOString();
  // }
}
