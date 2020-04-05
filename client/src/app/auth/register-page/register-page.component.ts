import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AuthService } from '../../shared/services/auth.service';
import { MaterialService } from '../../shared/classes/material.service';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit, OnDestroy {

  form: FormGroup;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      balanceRUB: new FormControl(0, [Validators.nullValidator]),
      balanceUSD: new FormControl(0, [Validators.nullValidator]),
      balanceEUR: new FormControl(0, [Validators.nullValidator]),
    });
  }

  onSubmit() {
    this.form.disable();
    this.auth.register(this.form.value).pipe(untilDestroyed(this)).subscribe(
      (res) => {
        this.router.navigate(['/login'], {
          queryParams: { registered: true }
        });
      },
      (error) => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      }
    );
  }

  ngOnDestroy(): void {}
}
