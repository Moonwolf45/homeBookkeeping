import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Category } from '../../../shared/intefaces';
import { CategoryService } from '../../../shared/services/category.service';
import { MaterialService } from '../../../shared/classes/material.service';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit, OnDestroy, AfterViewInit {
  instance;
  form: FormGroup;

  @Input() categories: Category[] = [];
  @Output() categoryEdit = new EventEmitter<Category>();

  currentCategory: Category;

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.onCategoryChange(null);

    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      color: new FormControl(null, [Validators.required]),
    });
  }

  ngAfterViewInit() {
    this.instance = MaterialService.initSelect(document.getElementById('select-category'));
  }

  onCategoryChange(event) {
    if (event === null) {
      this.currentCategory = this.categories[0];
    } else {
      this.currentCategory = this.categories.find(c => c._id === event.value);
    }
  }

  onSubmit() {
    this.form.disable();
    const editCategory = {
      ...this.form.value,
      _id: this.currentCategory._id
    };
    this.categoryService.editCategory(editCategory).pipe(untilDestroyed(this)).subscribe((category: Category) => {
      this.categoryEdit.emit(category);
      MaterialService.toast('Категория изменена');
      this.form.reset();
      this.onCategoryChange(null);
      this.form.enable();
    }, (error) => {
      MaterialService.toast(error.error.message);
      this.form.enable();
    });
  }

  ngOnDestroy(): void {}
}
