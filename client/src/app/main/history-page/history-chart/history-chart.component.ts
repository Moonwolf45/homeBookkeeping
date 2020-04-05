import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-history-chart',
  templateUrl: './history-chart.component.html',
  styleUrls: ['./history-chart.component.scss']
})
export class HistoryChartComponent implements OnInit {
  legendPosition = 'right';
  colors = [
    {
      name: 'Автотранспорт',
      value: '#2c65ff'
    },
    {
      name: 'Бизнес, проекты',
      value: '#12366a'
    },
    {
      name: 'Бытовая техника',
      value: '#fff714',
    },
    {
      name: 'Долги, кредит',
      value: '#32d5ff',
    },
    {
      name: 'Дом, квартира, дача',
      value: '#34215e',
    }
  ];

  @Input() data: any[] = [];

  constructor() {}

  ngOnInit(): void {}
}
