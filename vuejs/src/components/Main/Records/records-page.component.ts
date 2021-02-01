import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Category } from '../../shared/intefaces';
import { CategoryService } from '../../shared/services/category.service';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-records-page',
  templateUrl: './records-page.component.html',
  styleUrls: ['./records-page.component.scss']
})
export class RecordsPageComponent implements OnInit {
  categories: Category[] = [];
  isLoaded = false;

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getCategories().pipe(untilDestroyed(this)).subscribe((categories: Category[]) => {
      this.categories = categories;
      this.isLoaded = true;
    });
  }

  newCategoryAdd(category: Category) {
    this.categories.push(category);
  }

  onCategoryUpdate(category: Category) {
    const idx = this.categories.findIndex(c => c._id === category._id);
    this.categories[idx] = category;
  }
}
