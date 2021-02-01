import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { MaterialService } from '../../../shared/classes/material.service';
import { Category } from '../../../shared/intefaces';
import { EventService } from '../../../shared/services/event.service';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit, AfterViewInit, OnDestroy {
  instance;
  instance1;
  form: FormGroup;
  error = {
    amount: false,
    text: ''
  };

  @Input() categories: Category[] = [];
  types = [
    { type: 'income', label: 'Доход' },
    { type: 'outcome', label: 'Расход' }
  ];
  currencies = [
    { type: 'rub', label: 'RUB' },
    { type: 'usd', label: 'USD' },
    { type: 'eur', label: 'EUR' }
  ];

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    MaterialService.initTextarea(document.getElementById('textarea-description'));
    this.form = new FormGroup({
      category_id: new FormControl(null, [Validators.required]),
      currency: new FormControl('RUB', [Validators.required]),
      type: new FormControl('income', [Validators.required]),
      amount: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.nullValidator]),
    });
  }

  ngAfterViewInit() {
    this.instance = MaterialService.initSelect(document.getElementById('get-category'));
    this.instance1 = MaterialService.initSelect(document.getElementById('get-currency'));
  }

  onSubmit() {
    this.form.disable();
    const finance = {
      ...this.form.value,
      date: Date.now()
    };
    this.eventService.addEvent(finance).pipe(untilDestroyed(this)).subscribe(() => {
        MaterialService.toast('Операция создана');
        this.form.reset();
      }, (error) => {
        MaterialService.toast(error.error.message);
        this.error.amount = true;
        this.error.text = 'Расход превышает остаток';
        this.form.enable();
      }
    );
  }

  ngOnDestroy(): void {}
}
