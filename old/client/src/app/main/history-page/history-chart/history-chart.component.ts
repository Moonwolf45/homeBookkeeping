import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-history-chart',
  templateUrl: './history-chart.component.html',
  styleUrls: ['./history-chart.component.scss']
})
export class HistoryChartComponent implements OnInit {
  @Input() legendName = '';
  @Input() categories = [];

  legendPosition = 'right';
  colors = [];

  @Input() data: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.categories.forEach((category) => {
      this.colors.push({name: category.title, value: category.color});
    });
  }
}
