import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'avatar'
})
export class AutoAvatarPipe implements PipeTransform {

  autoAvatar(link: string) {
    return this.validLink(link) ? link : '/assets/avatar.png';
  }

  validLink(link: string) {
    return link &&(link.startsWith('http') || link.startsWith('/'));
  }

  transform(value: string, ...args: unknown[]): string {
    return this.autoAvatar(value);
  }

}
