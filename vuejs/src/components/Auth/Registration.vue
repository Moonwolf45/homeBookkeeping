<template>
<!--  <div class="auth-content">-->
<!--    <p class="text-xs-center">Регистрация для получения доступа</p>-->
<!--    <form [formGroup]="form" (ngSubmit)="onSubmit()">-->
<!--      <div class="input-field">-->
<!--        <input id="username" type="text" formControlName="username" [ngClass]="{ 'invalid': form.get('username').invalid-->
<!--        && form.get('username').touched }">-->
<!--        <label for="username">Имя:</label>-->
<!--        <span class="helper-text red-text" *ngIf="form.get('username').invalid && form.get('username').touched">-->
<!--        <span *ngIf="form.get('username').errors['required']">Имя не должен быть пустым</span>-->
<!--      </span>-->
<!--      </div>-->

<!--      <div class="input-field">-->
<!--        <input id="email" type="email" formControlName="email" [ngClass]="{ 'invalid': form.get('email').invalid-->
<!--        && form.get('email').touched }">-->
<!--        <label for="email">Email:</label>-->
<!--        <span class="helper-text red-text" *ngIf="form.get('email').invalid && form.get('email').touched">-->
<!--        <span *ngIf="form.get('email').errors['required']">E-mail не должен быть пустым</span>-->
<!--        <span *ngIf="form.get('email').errors['email']">Введите корректный e-mail</span>-->
<!--      </span>-->
<!--      </div>-->

<!--      <div class="input-field">-->
<!--        <input id="password" type="password" formControlName="password" [ngClass]="{ 'invalid': form.get('password').invalid-->
<!--        && form.get('password').touched }">-->
<!--        <label for="password">Пароль:</label>-->
<!--        <span class="helper-text red-text" *ngIf="form.get('password').invalid && form.get('password').touched">-->
<!--        <span *ngIf="form.get('password').errors['required']">Пароль не должен быть пустым</span>-->
<!--        <span *ngIf="form.get('password').errors['minlength']-->
<!--          && form.get('password').errors['minlength']['requiredLength']">-->
<!--          Пароль должен быть больше {{ form.get('password').errors['minlength']['requiredLength'] }} символов.-->
<!--          Сейчас {{ form.get('password').errors['minlength']['actualLength'] }}-->
<!--        </span>-->
<!--      </span>-->
<!--      </div>-->

<!--      <div class="card-action">-->
<!--        <button type="submit" class="modal-action btn waves-effect" [disabled]="form.invalid || form.disabled">Зарегистрироваться</button>-->
<!--      </div>-->

<!--      <div class="form-group">-->
<!--        <p class="text-muted text-xs-center">-->
<!--          Уже есть аккаунт?-->
<!--          <a [routerLink]="['/login']">Войти!</a>-->
<!--        </p>-->
<!--      </div>-->
<!--    </form>-->
<!--  </div>-->

  <v-row>
    <v-col>
      <h1>Registration</h1>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "Registration"
}
</script>

<style scoped lang="scss">

</style>
