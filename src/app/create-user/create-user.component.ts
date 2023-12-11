import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Component, OnInit, Output} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
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
export class CreateUserComponent implements OnInit {
  private readonly baseUrl: string = configurl.apiServer.url + "/api/user/";
  userForm!: FormGroup;
  @Output() public user: UserCreateDto = new UserCreateDto();
  // passwordForm!: FormGroup;
  @Output() roles: Role[] = [{value: 'DOCTOR', viewValue: 'Doctor'}, {value: 'PATIENT', viewValue: 'Patient'}];

  constructor(private authService: AuthService,
              private jwtHelper: JwtHelperService,
              private httpClient: HttpClient,
              private passConfValidator: PasswordConfirmationValidatorService,
              private router: Router,
              private snackBar: MatSnackBar,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{10}$")]),
      email: ['', [Validators.required, Validators.email]],
      roleSelector: ['', Validators.required],
      officeNumber: [''], // Conditionally required
      birthDate: [''], // Conditionally required
      insuranceNumber: [''], // Conditionally required
      password: ['', Validators.required],
      confirm: ['', Validators.required]
    });
      this.userForm.get('confirm')?.setValidators([
        Validators.required, this.passConfValidator.validateConfirmPassword(this.userForm?.get('password'))
      ]);


    // Logic to handle conditional validators
    this.userForm.get('roleSelector')?.valueChanges.subscribe(value => {
      if (value === 'DOCTOR') {
        this.userForm.get('officeNumber')?.setValidators(Validators.required);
        this.userForm.get('birthDate')?.clearValidators();
        this.userForm.get('insuranceNumber')?.clearValidators();
      } else if (value === 'PATIENT') {
        this.userForm.get('birthDate')?.setValidators(Validators.required);
        this.userForm.get('insuranceNumber')?.setValidators(Validators.required);
        this.userForm.get('officeNumber')?.clearValidators();
      }
      this.userForm.get('officeNumber')?.updateValueAndValidity();
      this.userForm.get('birthDate')?.updateValueAndValidity();
      this.userForm.get('insuranceNumber')?.updateValueAndValidity();
    });
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
