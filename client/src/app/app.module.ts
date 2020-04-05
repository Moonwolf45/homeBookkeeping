import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import localeRuExtra from '@angular/common/locales/extra/ru';
import localeFr from '@angular/common/locales/fr';
import localeFrExtra from '@angular/common/locales/extra/fr';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './auth/login-page/login-page.component';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { RegisterPageComponent } from './auth/register-page/register-page.component';
import { TokenInterceptor } from './shared/classes/token.interceptor';
import { OverviewPageComponent } from './main/overview-page/overview-page.component';
import { HistoryPageComponent } from './main/history-page/history-page.component';
import { PlanningPageComponent } from './main/planning-page/planning-page.component';
import { RecordsPageComponent } from './main/records-page/records-page.component';
import { BillCardComponent } from './main/overview-page/bill-card/bill-card.component';
import { CurrencyCardComponent } from './main/overview-page/currency-card/currency-card.component';
import { AddEventComponent } from './main/records-page/add-event/add-event.component';
import { AddCategoryComponent } from './main/records-page/add-category/add-category.component';
import { EditCategoryComponent } from './main/records-page/edit-category/edit-category.component';
import { HistoryChartComponent } from './main/history-page/history-chart/history-chart.component';
import { HistoryEventsComponent } from './main/history-page/history-events/history-events.component';
import { HistoryDetailComponent } from './main/history-page/history-detail/history-detail.component';
import { HistoryFilterComponent } from './main/history-page/history-filter/history-filter.component';
import { FilterPipe } from './shared/pipes/filter.pipe';

registerLocaleData(localeRu, 'ru-RU', localeRuExtra);
registerLocaleData(localeFr, 'fr-FR', localeFrExtra);

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
    RegisterPageComponent,
    OverviewPageComponent,
    HistoryPageComponent,
    PlanningPageComponent,
    RecordsPageComponent,
    BillCardComponent,
    CurrencyCardComponent,
    AddEventComponent,
    AddCategoryComponent,
    EditCategoryComponent,
    HistoryChartComponent,
    HistoryEventsComponent,
    HistoryDetailComponent,
    HistoryFilterComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxChartsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, multi: true, useClass: TokenInterceptor }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
