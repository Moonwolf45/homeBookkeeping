import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

  date: Date = new Date();
  username: string;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.username = this.auth.getUsername();
  }

  onExit() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
