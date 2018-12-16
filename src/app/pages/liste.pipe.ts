import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'liste'
})
export class ListePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
