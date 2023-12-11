import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Component, Output} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {JwtHelperService} from "@auth0/angular-jwt";
import configurl from '../../assets/config/config.json';
import {AuthService} from "../service/auth.service";
import {
  PasswordConfirmationValidatorService
} from "../shared/custom-validators/password-confirmation-validator.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'create-user-component',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {
  private readonly baseUrl: string = configurl.apiServer.url + "/api/user/";
  passwordMismatch: boolean = false;
  submitClicked: boolean = false;
  @Output() public user: UserCreateDto = new UserCreateDto();
  userForm!: FormGroup;
  @Output() roles: Role[] = [{value: 'DOCTOR', viewValue: 'Doctor'}, {value: 'PATIENT', viewValue: 'Patient'}];

  constructor(private authService: AuthService,
              private jwtHelper: JwtHelperService,
              private httpClient: HttpClient,
              private passConfValidator: PasswordConfirmationValidatorService,
              private router: Router,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.userForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      confirm: new FormControl('')
    });
    this.userForm.get('confirm')?.setValidators([
        Validators.required, this.passConfValidator.validateConfirmPassword(this.userForm?.get('password'))]);
    this.userForm.get('password')?.valueChanges.subscribe(() => {
      this.checkPasswords();
    });
    this.userForm.get('confirm')?.valueChanges.subscribe(() => {
      this.checkPasswords();
    });
    this.userForm.valueChanges.subscribe(() => {
      this.submitClicked = false;
    });
  }

  checkPasswords(): void {
    const password = this.userForm.get('password')?.value;
    const confirmPassword = this.userForm.get('confirm')?.value;
    this.passwordMismatch = password !== confirmPassword;
  }

  isUserAuthenticated(): boolean {
    const token = sessionStorage.getItem("app.token");
    return !!(token && !this.jwtHelper.isTokenExpired(token));
  }

  public isAdmin(): boolean {
    return this.isUserAuthenticated() && this.authService.isAdmin();
  }

  public validateControl = (controlName: string) => {
    return this.userForm?.get(controlName)?.invalid && this.userForm?.get(controlName)?.touched
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.userForm?.get(controlName)?.hasError(errorName)
  }

  public update(user: UserCreateDto, passwordFormValue: any, role: string): void {
    this.submitClicked = true;

    if (this.passwordMismatch) {
      return;
    }

    const formValues = {...passwordFormValue};
    user.password = formValues.password;
    user.role = role;

    this.httpClient.post(`api/${role.toLowerCase()}/create`, JSON.stringify(user), {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    }).subscribe({
      next: (_) => this.snackBar.open(`User successfully created: ${user.email}`, "OK")
    });

    this.submitClicked = false;
  }

  cancel(): void {
    this.passwordMismatch = false
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
