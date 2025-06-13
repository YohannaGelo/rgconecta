import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linkify',
  standalone: false
})
export class LinkifyPipe implements PipeTransform {

  transform(text: string): string {
    if (!text) return '';
    const urlRegex = /((https?:\/\/|www\.)[^\s]+)/g;

    return text.replace(urlRegex, (url: string) => {
      const hyperlink = url.startsWith('http') ? url : `https://${url}`;
      return `<a href="${hyperlink}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
  }

}
