import { HttpClient } from '@angular/common/http';
import { Component, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import configurl from '../../assets/config/config.json';
import {AuthService} from "../service/auth.service";

@Component({
  selector: 'homepage-component',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {

  @Output()
  public tableList?: User[];
  public currentType?: string;

  constructor(
    private authService: AuthService,
    private actRoute: ActivatedRoute,
    private jwtHelper: JwtHelperService,
    private httpClient: HttpClient,
    private router: Router,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.fillTable();
  }

  isUserAuthenticated(): boolean {
    return this.authService.isUserAuthenticated();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  fillTable(): void {
    let type = this.actRoute.snapshot.params['type']
    this.tableList = [];
    if (type) {
      this.httpClient.get<User[]>("api/" + type + "/list").subscribe(
        (users: User[]) => {
          this.tableList = users;
          users.forEach(
            (u) => console.log(u.firstName + " " + u.lastName)
          );
        }
      );
    } else {
      this.httpClient.get<User[]>("api/patient/list").subscribe(
        (users: User[]) => {
          this.tableList = users;
          users.forEach(
            (u) => console.log(u.firstName + " " + u.lastName)
          );
        }
      );
    }
    console.log(this.tableList?.toString());
  }

  public moreInfo($event: any, uuid: string, role: string): void {
    switch (role) {
      case "PATIENT":
        this.router.navigate(["patient", { uuid: uuid }])
        break;
      case "DOCTOR":
        this.router.navigate(["doctor", { uuid: uuid }])
        break;
      case "ADMIN":
        this.router.navigate(["admin", { uuid: uuid }])
        break;
    }
  }

  public delete($event: any, uuid: string, role: string): void {
    this.httpClient.delete(`api/${role.toLowerCase()}/delete/${uuid}`)
      .subscribe({
        next: _ => this.tableList = this.tableList?.filter(user => user.uuid !== uuid),
        error: error => console.log("User delete error.")
      }
    );
  }
}

export interface User {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}
