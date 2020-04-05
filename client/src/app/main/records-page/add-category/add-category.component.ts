import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { MaterialService } from '../../../shared/classes/material.service';
import { CategoryService } from '../../../shared/services/category.service';
import { Category } from '../../../shared/intefaces';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit, OnDestroy {
  form: FormGroup;

  @Output() newCategory = new EventEmitter<Category>();

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required]),
    });
  }

  onSubmit() {
    this.form.disable();
    this.categoryService.addCategory(this.form.value).pipe(untilDestroyed(this)).subscribe((category: Category) => {
        this.newCategory.emit(category);
        MaterialService.toast('Категория создана');
        this.form.reset();
      }, (error) => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      }
    );
  }

  ngOnDestroy(): void {}
}
