import {Component, OnInit, Output} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthUserDto} from "../myprofile/myprofile.component";
import {AuthService} from "../service/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {

  @Output()
  public passwordChangeForm: PasswordChangeForm = new PasswordChangeForm();

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
  }

  public update(form?: PasswordChangeForm): void {
    if (!this.authService.isUserAuthenticated()) {
      return;
    }

    this.httpClient.post(`api/authentication/update-password`, JSON.stringify(form), {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    }).subscribe(
      {
        next: (_) => this.snackBar.open("Password successfully changed!", "OK")
      }
    );
  }
}

export class PasswordChangeForm {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}
