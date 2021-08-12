import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest } from 'rxjs';

import { CategoryService } from '../../shared/services/category.service';
import { EventService } from '../../shared/services/event.service';
import { Category, Finance } from '../../shared/intefaces';
import { MaterialService } from '../../shared/classes/material.service';
import * as moment from 'moment';
import { AuthService } from '../../shared/services/auth.service';
import { OverviewService } from '../../shared/services/overview.service';


@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, AfterViewInit, OnDestroy {
  instance;
  isLoaded = false;

  categories: Category[] = [];
  events: Finance[] = [];
  filteredEvents: Finance[] = [];
  currency: any;

  incomeData = [];
  outcomeData = [];

  isFilterVisible = false;

  constructor(private categoryService: CategoryService, private eventService: EventService, private overviewService: OverviewService) { }

  ngOnInit(): void {
    combineLatest([this.categoryService.getCategories(), this.eventService.getEvents(),
      this.overviewService.getCurrency()]).pipe(untilDestroyed(this)).subscribe((data: [Category[], Finance[], any]) => {
      this.categories = data[0];
      this.events = data[1];
      this.currency = data[2];

      this.setOriginalEvents();
      this.calculateChartData();

      this.isLoaded = true;
    });
  }

  ngAfterViewInit(): void {
    this.instance = MaterialService.initModal(document.getElementById('filter-modal'));
  }

  private setOriginalEvents() {
    this.filteredEvents = this.events.slice();
  }

  calculateChartData(): void {
    this.incomeData = [];
    this.outcomeData = [];

    this.categories.forEach((category) => {
      const catEvent = this.filteredEvents.filter((event) => event.category_id === category._id && event.type === 'income');
      this.incomeData.push({
        name: category.title,
        value: catEvent.reduce((total, event) => {
          if (event.currency === 'USD') {
            total += (event.amount * this.currency.Valute.USD.Value);
          } else if (event.currency === 'EUR') {
            total += (event.amount * this.currency.Valute.EUR.Value);
          } else {
            total += event.amount;
          }
          return total;
        }, 0)
      });
    });

    this.categories.forEach((category) => {
      const catEvent = this.filteredEvents.filter((event) => event.category_id === category._id && event.type === 'outcome');
      this.outcomeData.push({
        name: category.title,
        value: catEvent.reduce((total, event) => {
          if (event.currency === 'USD') {
            total += (event.amount * this.currency.Valute.USD.Value);
          } else if (event.currency === 'EUR') {
            total += (event.amount * this.currency.Valute.EUR.Value);
          } else {
            total += event.amount;
          }
          return total;
        }, 0)
      });
    });
  }

  private toggleFilterVisibility(dir: boolean) {
    this.isFilterVisible = dir;
  }

  onFilter() {
    this.toggleFilterVisibility(true);
  }

  private getLastDayOfMonth(year, month) {
    const date = new Date(year, month + 1, 0);
    return date.getDate();
  }

  onFilterApply(filterData) {
    this.toggleFilterVisibility(false);
    this.setOriginalEvents();

    let startPeriod;
    let endPeriod;
    if (filterData.period === 'd') {
      startPeriod = moment().startOf('d');
      endPeriod = moment().endOf('d');
    } else if (filterData.period === 'w') {
      startPeriod = moment().startOf('w');
      endPeriod = moment().endOf('w');
    } else if (filterData.period === 'M') {
      startPeriod = moment().startOf('M');
      endPeriod = moment().endOf('M');
    } else {
      startPeriod = moment().startOf('y');
      endPeriod = moment().endOf('y');
    }

    this.filteredEvents = this.filteredEvents.filter((event) => {
      return filterData.types.indexOf(event.type) !== -1;
    }).filter((event) => {
      return filterData.categories.indexOf(event.category_id.toString()) !== -1;
    }).filter((event) => {
      const momentDate = +event.date;
      if (Date.parse(startPeriod) <= momentDate && momentDate <= Date.parse(endPeriod)) {
        return event;
      }
    });

    this.calculateChartData();
  }

  onFilterCancel() {
    this.toggleFilterVisibility(false);
    this.setOriginalEvents();
    this.calculateChartData();
  }

  ngOnDestroy(): void {}
}
