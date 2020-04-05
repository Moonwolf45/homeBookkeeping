import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest } from 'rxjs';

import { CategoryService } from '../../shared/services/category.service';
import { EventService } from '../../shared/services/event.service';
import { Category, Finance } from '../../shared/intefaces';


@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy {

  isLoaded = false;

  categories: Category[] = [];
  events: Finance[] = [];

  incomeData = [];
  outcomeData = [];

  constructor(private categoryService: CategoryService, private eventService: EventService) { }

  ngOnInit(): void {
    combineLatest([this.categoryService.getCategories(), this.eventService.getEvents()]).pipe(untilDestroyed(this)).subscribe(
      (data: [Category[], Finance[]]) => {
      this.categories = data[0];
      this.events = data[1];

      this.calculateChartData();

      this.isLoaded = true;
    });
  }

  calculateChartData(): void {
    this.incomeData = [];
    this.outcomeData = [];

    this.categories.forEach((category) => {
      // @ts-ignore
      const catEvent = this.events.filter((event) => event.category_id === category._id && event.type === 'income');
      this.incomeData.push({
        name: category.title,
        value: catEvent.reduce((total, event) => {
          total += event.amount;
          return total;
        }, 0)
      });
    });

    this.categories.forEach((category) => {
      // @ts-ignore
      const catEvent = this.events.filter((event) => event.category_id === category._id && event.type === 'outcome');
      this.outcomeData.push({
        name: category.title,
        value: catEvent.reduce((total, event) => {
          total += event.amount;
          return total;
        }, 0)
      });
    });
  }

  ngOnDestroy(): void {}
}
