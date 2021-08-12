import { Component, Input, OnInit } from '@angular/core';

import { User } from '../../../shared/intefaces';

@Component({
  selector: 'app-bill-card',
  templateUrl: './bill-card.component.html',
  styleUrls: ['./bill-card.component.scss']
})
export class BillCardComponent implements OnInit {

  @Input() bill: User;

  constructor() { }

  ngOnInit(): void {
  }

}
