import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AboutModalComponent } from '../about-modal/about-modal.component';
import { ABOUT_INFO } from '../../../../environments/enviroment.about';

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
}
