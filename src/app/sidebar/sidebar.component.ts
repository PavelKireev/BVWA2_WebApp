import { Component, OnInit } from '@angular/core';
import { AuthService } from "../service/auth.service";
import { Router } from "@angular/router";
import { ChatService } from "../service/chat-service/chat-showcase.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public sidebarLinks : any[] = [];

  constructor(private authService: AuthService,
              private router: Router,
              private chatService: ChatService
  ) {
      if (authService.isAdmin()) {
          this.sidebarLinks = [
              {route: '/my-profile', imgURL: '/assets/assets/user.svg', name: 'Profile'},
              {route: '/appointment', imgURL: '/assets/assets/calendar.svg', name: 'Appointments'},
              {route: '/create-user', imgURL: '/assets/assets/plus.svg', name: 'Create User'},
              {route: '/list/doctor', imgURL: '/assets/assets/doctors.svg', name: 'Doctors'},
              {route: '/list/patient', imgURL: '/assets/assets/members.svg', name: 'Patients'},
              {route: '/inbox', imgURL: '/assets/assets/letter.svg', name: 'Inbox'},
              {route: '/outbox', imgURL: '/assets/assets/pen.svg', name: 'Outbox'}
          ];
      } else if (authService.isDoctor()) {
          this.sidebarLinks = [
              {route: '/my-profile', imgURL: '/assets/assets/user.svg', name: 'Profile'},
              {route: '/working-hours', imgURL: '/assets/assets/timer.svg', name: 'Working Hours'},
              {route: '/appointment', imgURL: '/assets/assets/calendar.svg', name: 'Appointments'},
              {route: '/list/patient', imgURL: '/assets/assets/members.svg', name: 'Patients'},
              {route: '/inbox', imgURL: '/assets/assets/unread.svg', name: 'Inbox'},
              {route: '/inbox', imgURL: '/assets/assets/letter.svg', name: 'Inbox'},
              {route: '/outbox', imgURL: '/assets/assets/pen.svg', name: 'Outbox'}
          ];
      } else {
          this.sidebarLinks = [
              {route: '/my-profile', imgURL: '/assets/assets/user.svg', name: 'Profile'},
              {route: '/appointment', imgURL: '/assets/assets/calendar.svg', name: 'Appointments'},
              {route: '/inbox', imgURL: '/assets/assets/unread.svg', name: 'Inbox'},
              {route: '/inbox', imgURL: '/assets/assets/letter.svg', name: 'Inbox'},
              {route: '/outbox', imgURL: '/assets/assets/pen.svg', name: 'Outbox'}
          ];
      }

      this.chatService.notifyNewMessagesAvailable.subscribe((newMessagesAvailable: boolean) => {
        if (newMessagesAvailable) {
          this.sidebarLinks.forEach(link => {
            link.imgURL = link.imgURL === '/assets/assets/letter.svg' ? '/assets/assets/unread.svg'
                                                                      : link.imgURL
          });
        } else {
            this.sidebarLinks.forEach(link => {
              link.imgURL = link.imgURL === '/assets/assets/unread.svg' ? '/assets/assets/letter.svg'
                                                                        : link.imgURL
            });
        }
      });
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
