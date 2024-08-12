import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  router = inject(Router);
  usersService = inject(UsersService);

  isLogged!: Observable<boolean>;
  currentUser!: Observable<any>;

  ngOnInit() {
    this.isLogged = this.usersService.isLogged();
    this.currentUser = this.usersService.getCurrentUser();
  }

  onClickLogout() {
    this.usersService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: error => {
        console.error('Error al cerrar sesión:', error);
      }
    });
  }
}
