import { StorageService } from './services/storage/storage.service';
import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { LoginComponent } from './views/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { BankingService } from './services/banking/banking.service';
import { AuthService } from './services/auth/auth.service';
import { AuthGuard } from './services/auth/auth-guard.service';
import { RegisterComponent } from './views/register/register.component';
import { routing } from './app.routes';
import { UserService } from './services/user/user.service';
import { GettingStartedComponent } from './components/getting-started/getting-started.component';
import { StorageServiceModule} from 'angular-webstorage-service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SettingsComponent } from './components/settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    GettingStartedComponent,
    NavbarComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    routing,
    StorageServiceModule
  ],
  entryComponents: [
    SettingsComponent
  ],
  providers: [
    BankingService,
    AuthService,
    AuthGuard,
    UserService,
    StorageService,
    NgbActiveModal
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
