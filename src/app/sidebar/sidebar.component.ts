import { Component, OnInit } from '@angular/core';
import {AuthService} from "../service/auth.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public sidebarLinks : any[] = [];

  constructor(private authService: AuthService) {

      if (authService.isAdmin()) {
          this.sidebarLinks = [
              {route: '/my-profile', imgURL: '/assets/assets/user.svg', name: 'Profile'},
              {route: '/appointment', imgURL: '/assets/assets/calendar.svg', name: 'Appointments'},
              {route: '/doctor', imgURL: '/assets/assets/doctors.svg', name: 'Doctors'},
              {route: '/patient', imgURL: '/assets/assets/members.svg', name: 'Patients'},
              {route: '/create-user', imgURL: '/assets/assets/plus.svg', name: 'Create User'}
          ];
      } else if (authService.isDoctor()) {
          this.sidebarLinks = [
              {route: '/my-profile', imgURL: '/assets/assets/user.svg', name: 'Profile'},
              {route: '/working-hours', imgURL: '/assets/assets/timer.svg', name: 'Working Hours'},
              {route: '/appointment', imgURL: '/assets/assets/calendar.svg', name: 'Appointments'},
              {route: '/patient', imgURL: '/assets/assets/members.svg', name: 'Patients'}
          ];
      } else {
          this.sidebarLinks = [
              {route: '/my-profile', imgURL: '/assets/assets/user.svg', name: 'Profile'},
              {route: '/appointment', imgURL: '/assets/assets/calendar.svg', name: 'Appointments'},
          ];
      }

  }

  get isUserAuthenticated(): boolean {
    return this.authService.isUserAuthenticated();
  }

  signOut(): void {
    this.authService.logout();
  }

  public isActive(linkRoute: string, currentPath: string): boolean {
    return (currentPath.includes(linkRoute) && linkRoute.length > 1) || currentPath === linkRoute;
  }

  ngOnInit(): void {
  }
}
