import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';

import { MaterialService } from '../../../shared/classes/material.service';
import { Category } from '../../../shared/intefaces';

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss']
})
export class HistoryFilterComponent implements AfterViewInit {

  @Input() categories: Category[] = [];

  @Output() onFilterCancel = new EventEmitter<any>();
  @Output() onFilterApply = new EventEmitter<any>();

  timePeriods = [
    { type: 'd', label: 'День' },
    { type: 'w', label: 'Неделя' },
    { type: 'M', label: 'Месяц' },
    { type: 'y', label: 'Год' }
  ];

  types = [
    { type: 'income', label: 'Доход' },
    { type: 'outcome', label: 'Расход' }
  ];

  selectedPeriod = 'd';
  selectedTypes = [];
  selectedCategories = [];

  ngAfterViewInit() {
    MaterialService.initSelect(document.getElementById('period'));
  }

  closeFilter() {
    this.selectedTypes = [];
    this.selectedCategories = [];
    this.selectedPeriod = 'd';
    this.onFilterCancel.emit();
  }

  private calculateInputParams(field: string, checked: boolean, value: string) {
    if (checked) {
      // tslint:disable-next-line:no-unused-expression
      this[field].indexOf(value) === -1 ? this[field].push(value) : null;
    } else {
      this[field] = this[field].filter(sT => sT !== value);
    }
  }

  handleChangeType({checked, value}) {
    this.calculateInputParams('selectedTypes', checked, value);
  }

  handleChangeCategory({checked, value}) {
    this.calculateInputParams('selectedCategories', checked, value);
  }

  applyFilter() {
    this.onFilterApply.emit({
      types: this.selectedTypes,
      categories: this.selectedCategories,
      period: this.selectedPeriod
    });
  }
}
