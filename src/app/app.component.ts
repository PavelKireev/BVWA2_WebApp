import {Component, OnInit} from '@angular/core';
import {initFlowbite} from "flowbite";
import {AuthService} from "./service/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Norman.zs';

  constructor(private authService: AuthService) {
  }

  get isUserAuthenticated(): boolean {
    return this.authService.isUserAuthenticated();
  }

  ngOnInit(): void {
    initFlowbite();
  }
}
