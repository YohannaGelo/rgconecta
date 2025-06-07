import {
  Directive,
  Renderer2,
  ElementRef,
  HostListener,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[appPasswordToggle]',
  standalone: false,
})
export class PasswordToggleDirective implements OnInit {
  private shown = false;
  private button!: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.button = this.renderer.createElement('i');
    this.renderer.addClass(this.button, 'bi');
    this.renderer.addClass(this.button, 'bi-eye-slash');
    this.renderer.setStyle(this.button, 'position', 'absolute');
    this.renderer.setStyle(this.button, 'right', '12px');
    this.renderer.setStyle(this.button, 'top', '50%');
    this.renderer.setStyle(this.button, 'transform', 'translateY(-50%)');
    this.renderer.setStyle(this.button, 'cursor', 'pointer');
    this.renderer.setStyle(this.button, 'z-index', '2');

    const wrapper = this.renderer.createElement('div');
    this.renderer.setStyle(wrapper, 'position', 'relative');
    const parent = this.el.nativeElement.parentNode;

    this.renderer.insertBefore(parent, wrapper, this.el.nativeElement);
    this.renderer.appendChild(wrapper, this.el.nativeElement);
    this.renderer.appendChild(wrapper, this.button);

    this.renderer.listen(this.button, 'click', () => {
      this.toggle();
    });
  }

  toggle() {
    this.shown = !this.shown;
    const type = this.shown ? 'text' : 'password';
    this.el.nativeElement.type = type;

    this.renderer.removeClass(
      this.button,
      this.shown ? 'bi-eye-slash' : 'bi-eye'
    );
    this.renderer.addClass(this.button, this.shown ? 'bi-eye' : 'bi-eye-slash');
  }
}
