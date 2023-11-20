import { Component, OnInit } from '@angular/core';
import {AuthService} from "../service/auth.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public sidebarLinks = [
    {route: '/home', imgURL: '/assets/assets/home.svg', name: 'Home'},
    {route: '/my-profile', imgURL: '/assets/assets/user.svg', name: 'Profile'},
    {route: '/create-user', imgURL: '/assets/assets/plus.svg', name: 'Create User'},
    {route: '/appointment', imgURL: '/assets/assets/calendar.svg', name: 'Appointments'},
    {route: '/doctor', imgURL: '/assets/assets/doctors.svg', name: 'Doctors'},
    {route: '/patient', imgURL: '/assets/assets/members.svg', name: 'Patients'},
  ];


  constructor(private authService: AuthService) {
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