<template>
<!--  <div class="auth-content">-->
<!--    <p class="text-xs-center">Войдите для работы</p>-->
<!--    <form [formGroup]="form" (ngSubmit)="onSubmit()">-->
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
<!--        <button type="submit" class="modal-action btn waves-effect" [disabled]="form.invalid || form.disabled">Войти</button>-->
<!--      </div>-->

<!--      <div class="form-group">-->
<!--        <p class="text-muted text-xs-center">-->
<!--          Нет аккаунта? <a [routerLink]="['/registration']">Зарегистрироваться!</a>-->
<!--        </p>-->
<!--      </div>-->
<!--    </form>-->
<!--  </div>-->

  <v-row>
    <v-col class="d-flex align-center justify-center">
      <v-card elevation="2" outlined>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-text>
            <v-text-field v-model="name" :counter="10" :rules="nameRules" label="Name" required></v-text-field>
            <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
            <v-select v-model="select" :items="items" :rules="[v => !!v || 'Item is required']" label="Item" required>
            </v-select>

            <v-checkbox v-model="checkbox" :rules="[v => !!v || 'You must agree to continue!']" label="Do you agree?"
                required></v-checkbox>
          </v-card-text>

          <v-card-actions>
            <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">
              Validate
            </v-btn>

            <v-btn color="error" class="mr-4" @click="reset">
              Reset Form
            </v-btn>

            <v-btn color="warning" @click="resetValidation">
              Reset Validation
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data () {
    return {
      valid: true,
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      select: null,
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
      ],
      checkbox: false,
    }
  },
  methods: {
    validate () {
      this.$refs.form.validate()
    },
    reset () {
      this.$refs.form.reset()
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    },
  },
}
</script>

<style scoped lang="scss">

</style>
