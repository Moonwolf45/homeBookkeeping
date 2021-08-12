<template>
<!--  <div class="dashboard">-->
<!--    <div class="title-block">-->
<!--      <h3 class="title left">-->
<!--        Страница истории <span class="sparkline bar"></span>-->
<!--      </h3>-->
<!--      <div class="right">-->
<!--        <button class="waves-effect waves-light btn modal-trigger" (click)="onFilter()">-->
<!--          <i class="material-icons">filter_list</i>-->
<!--        </button>-->
<!--      </div>-->
<!--    </div>-->

<!--    <div class="col s12 center" *ngIf="!isLoaded">-->
<!--      <app-loader></app-loader>-->
<!--    </div>-->
<!--    <div *ngIf="isLoaded">-->
<!--      <div class="row">-->
<!--        <app-history-chart [categories]="categories" [data]="incomeData" [legendName]="'Доход'"></app-history-chart>-->
<!--        <app-history-chart [categories]="categories" [data]="outcomeData" [legendName]="'Расход'"></app-history-chart>-->
<!--      </div>-->

<!--      <app-history-events [categories]="categories" [events]="filteredEvents"></app-history-events>-->

<!--      <div *ngIf="isFilterVisible">-->
<!--        <app-history-filter [categories]="categories" (onFilterApply)="onFilterApply($event)" (onFilterCancel)="onFilterCancel()">-->
<!--        </app-history-filter>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->

  <v-row>
    <v-col>
      <h1>Planning</h1>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'History'
}
</script>

<style scoped>

</style>
