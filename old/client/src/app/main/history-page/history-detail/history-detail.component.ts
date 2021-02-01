import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { EventService } from '../../../shared/services/event.service';
import { CategoryService } from '../../../shared/services/category.service';
import { Category, Finance } from '../../../shared/intefaces';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.scss']
})
export class HistoryDetailComponent implements OnInit {
  event: Finance;
  category: Category;

  isLoaded = false;

  constructor(private route: ActivatedRoute, private eventService: EventService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.route.params.pipe(untilDestroyed(this)).subscribe((params: Params) => {
      this.eventService.getEventsById(params.id).pipe(untilDestroyed(this)).subscribe((event: Finance) => {
        this.event = event;
        this.categoryService.getCategoryById(event.category_id).pipe(untilDestroyed(this)).subscribe((category: Category) => {
          this.category = category;
          this.isLoaded = true;
        });
      });
    });
  }
}
