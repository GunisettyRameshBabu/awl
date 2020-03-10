import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(item: any, filter: (x) => Observable<any>): any {
    if (!item || !filter) {
      return false;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return filter(item);
  }

}
