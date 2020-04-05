import { Pipe, PipeTransform } from '@angular/core';
import { Finance } from '../intefaces';


@Pipe({
  name: 'appFilter'
})
export class FilterPipe implements PipeTransform {
  transform(items: Finance[], value: string, field: string): any {
    if (items.length === 0 || !value) {
      return items;
    }

    return items.filter((item: Finance) => {
      const type = Object.assign({}, item);
      if (!isNaN(item[field])) {
        type[field] += '';
      }
      if (field === 'type') {
        // @ts-ignore
        type[field] = type[field] === 'income' ? 'доход' : 'расход';
      }
      if (field === 'category') {
        type[field] = type.categoryName;
      }
      return type[field].toLowerCase().indexOf(value.toLowerCase()) !== -1;
    });
  }
}
