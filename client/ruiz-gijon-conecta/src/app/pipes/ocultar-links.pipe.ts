import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'ocultarLinks',
  standalone: false,
})
export class OcultarLinksPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(texto: string): SafeHtml {
    if (!texto) return '';

    const urlRegex = /((https?:\/\/|www\.)[^\s]+)/g;

    const transformado = texto.replace(urlRegex, (url: string) => {
      const urlCortada = url.length > 12 ? url.slice(0, -6) + '…' : url;
      return `<span class="link-oculto">${urlCortada}</span>`;
    });

    return this.sanitizer.bypassSecurityTrustHtml(transformado);
  }
}
