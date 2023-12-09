import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { JwtModule } from "@auth0/angular-jwt";
import { AuthGuard } from './guards/auth-guard.service';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { DoctorComponent } from './doctor/doctor.component';
import { PatientComponent } from './patient/patient.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterUserComponent } from './authentication/register-user/register-user.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './service/auth.service';
import { MyProfileComponent } from './myprofile/myprofile.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { WorkingHoursComponent } from './working-hours/working-hours.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { WorkingHoursService } from './service/working-hours.service';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from "@angular/material/snack-bar";
import {HttpInterceptor} from "./service/http.interceptor";
import {NotFoundComponent} from "./error-pages/not-found.component";
import {LandingComponent} from "./landing/landing.component";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {PasswordChangeComponent} from "./password-change/password-change.component";
import {ChatComponent} from "./chat/chat.component";
import {DiscussionComponent} from "./chat/discussion/discussion.component";

const routes: Routes = [
  {path: '', redirectTo: '/landing', pathMatch: 'full'},
  {path: 'landing', component: LandingComponent},
  { path: 'list/:type', component: HomepageComponent }, // Updated route
  { path: 'appointment', component: AppointmentComponent},
  { path: 'doctor', component: DoctorComponent},
  { path: 'patient', component: PatientComponent },
  { path: 'registration', component: RegisterUserComponent },
  { path: 'login', component: LoginComponent },
  { path: 'my-profile', component: MyProfileComponent },
  { path: 'working-hours', component: WorkingHoursComponent },
  { path: 'create-user', component: CreateUserComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'password-change', component: PasswordChangeComponent },
  { path: 'inbox', component: ChatComponent },
  { path: 'outbox', component: DiscussionComponent },
  { path: '**', redirectTo: '/not-found' }
];

export function tokenGetter() {
  return sessionStorage.getItem("app.token");
}

@NgModule({
  declarations: [
    AppComponent,
    AppointmentComponent,
    DoctorComponent,
    HomepageComponent,
    LoginComponent,
    MyProfileComponent,
    NavMenuComponent,
    PatientComponent,
    RegisterUserComponent,
    WorkingHoursComponent,
    CreateUserComponent,
    NotFoundComponent,
    LandingComponent,
    SidebarComponent,
    PasswordChangeComponent,
    ChatComponent,
    DiscussionComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:8080"],
        disallowedRoutes: []
      }
    }),
  ],
  providers: [
    AuthGuard,
    MatDatepickerModule,
    AuthService,
    WorkingHoursService,
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {duration: 2500 }
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
