import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { OverviewService } from '../../shared/services/overview.service';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/intefaces';


@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss']
})
export class OverviewPageComponent implements OnInit, OnDestroy {

  currency: any;
  bill: User;
  userId: string;
  isLoaded = false;

  constructor(private auth: AuthService, private overviewService: OverviewService) { }

  ngOnInit(): void {
    this.userId = this.auth.getUserId();
    combineLatest([this.overviewService.getBill(this.userId), this.overviewService.getCurrency()]).pipe(untilDestroyed(this))
      .subscribe((data: [any, any]) => {
        this.bill = data[0].user;
        this.currency = data[1];

        this.isLoaded = true;
      }
    );
  }

  onRefresh() {
    this.isLoaded = false;
    this.overviewService.getCurrency().pipe(untilDestroyed(this)).subscribe((currency: any) => {
      this.currency = currency;

      this.isLoaded = true;
    });
  }

  ngOnDestroy(): void {}
}
