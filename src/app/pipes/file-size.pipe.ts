import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {

  private static readonly unit_list: string[] = [
    '', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'
  ]

  transform(value: number | string, ...args: any[]): string {
    let v = Number(value);
    let index = 0;
    while (v > 1024) {
      v /= 1024;
      index += 1;
    }
    return `${v.toFixed(index === 0 ? 0 : 2)}${FileSizePipe.unit_list[index]}`
  }

}
