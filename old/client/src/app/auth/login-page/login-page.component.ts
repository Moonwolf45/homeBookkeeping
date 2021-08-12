import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { AuthService } from '../../shared/services/auth.service';
import { MaterialService } from '../../shared/classes/material.service';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  form: FormGroup;

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    });

    this.route.queryParams.subscribe(
      (params: Params) => {
        if (params.registered) {
          MaterialService.toast('Теперь вы можете авторизоваться');
        } else if (params.accessDenied) {
          MaterialService.toast('Для начала авторизуйтесь в системе');
        } else if (params.sessionFailed) {
          MaterialService.toast('Время жизни токена закночилось. Авторизируйтесь снова.');
        }
      }
    );
  }

  onSubmit() {
    this.form.disable();
    this.auth.login(this.form.value).pipe(untilDestroyed(this)).subscribe(
      (res) => {
        this.router.navigate(['/overview']);
      },
      (error) => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      }
    );
  }

  ngOnDestroy(): void {}
}
