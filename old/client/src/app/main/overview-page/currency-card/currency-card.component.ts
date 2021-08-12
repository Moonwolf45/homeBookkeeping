import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-currency-card',
  templateUrl: './currency-card.component.html',
  styleUrls: ['./currency-card.component.scss']
})
export class CurrencyCardComponent implements OnInit {

  @Input() currency: any;
  date: Date;
  dateRub: Date = new Date();
  currencies: string[] = ['USD', 'EUR'];

  constructor() { }

  ngOnInit() {
    this.date = this.currency.Date;
  }

}
