import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import configurl from '../../assets/config/config.json';
import { AuthService } from "../service/auth.service";
import { PasswordConfirmationValidatorService } from "../shared/custom-validators/password-confirmation-validator.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'create-user-component',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {

  private readonly baseUrl: string = configurl.apiServer.url + "/api/user/";

  @Output()
  public user: UserCreateDto = new UserCreateDto();

  passwordForm!: FormGroup;
  errorMessage: string = '';
  showError: boolean = false;

  @Output()
  roles: Role[] = [
    { value: 'DOCTOR', viewValue: 'Doctor' },
    { value: 'PATIENT', viewValue: 'Patient' }
  ];

  constructor(
    private authService: AuthService,
    private jwtHelper: JwtHelperService,
    private httpClient: HttpClient,
    private passConfValidator: PasswordConfirmationValidatorService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const passwordPattern = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/;

    this.passwordForm = new FormGroup({
      password: new FormControl('',[Validators.required, Validators.pattern(passwordPattern)]),
      confirm: new FormControl('')
    });
    this.passwordForm.get('confirm')?.setValidators([Validators.required, this.passConfValidator.validateConfirmPassword(this.passwordForm?.get('password'))]);
  }

  isUserAuthenticated(): boolean {
    const token = localStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    else {
      return false;
    }
  }

  public isAdmin(): boolean {
    return this.isUserAuthenticated() && this.authService.isAdmin();
  }

  public validateControl = (controlName: string) => {
    return this.passwordForm?.get(controlName)?.invalid && this.passwordForm?.get(controlName)?.touched
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.passwordForm?.get(controlName)?.hasError(errorName)
  }

  public update(user: UserCreateDto, passwordFormValue: any, role: string): void {
    const formValues = { ...passwordFormValue };
    user.password = formValues.password;
    user.role = role;
    this.httpClient.post(this.baseUrl + "create", JSON.stringify(user), {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    }).subscribe({
      next: (_) => this.snackBar.open(`User successfully created: ${user.email}`, "OK" )
    });
  }
}

export class UserCreateDto {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: number;
  insuranceNumber?: string;
  birthDate?: Date;
  password?: string;
  officeNumber?: number;
  role?: string;
}

interface Role {
  value: string;
  viewValue: string;
}
