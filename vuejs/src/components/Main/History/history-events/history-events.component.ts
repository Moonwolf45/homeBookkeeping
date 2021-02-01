import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

import { Category, Finance } from '../../../shared/intefaces';
import { MaterialService } from '../../../shared/classes/material.service';

@Component({
  selector: 'app-history-events',
  templateUrl: './history-events.component.html',
  styleUrls: ['./history-events.component.scss']
})
export class HistoryEventsComponent implements OnInit, AfterViewInit {
  instance;
  @Input() categories: Category[];
  @Input() events: Finance[];
  searchValue = '';
  searchPlaceholder = 'Сумма';
  searchFiled = 'amount';

  constructor() { }

  ngOnInit(): void {
    this.events.forEach((finance) => {
      finance.categoryName = this.categories.find((category) => category._id === finance.category_id).title;
    });
  }

  ngAfterViewInit(): void {
    this.instance = MaterialService.initDropdown(document.querySelectorAll('.dropdown-trigger'));
  }

  changeCriteria(field: string) {
    const namesMap = {
      amount: 'Сумма',
      date: 'Дата',
      category: 'Категория',
      currency: 'Валюта',
      type: 'Тип'
    };

    this.searchPlaceholder = namesMap[field];
    this.searchFiled = field;
  }
}
