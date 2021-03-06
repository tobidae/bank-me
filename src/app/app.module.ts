import { StorageService } from './services/storage/storage.service';
import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';

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
import { MomentModule } from 'ngx-moment';
import { TransactionComponent } from './components/transaction/transaction.component';
import { TransactionCardComponent } from './components/transaction-card/transaction-card.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { ObjKeysPipe } from './pipes/obj-keys/obj-keys.pipe';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    GettingStartedComponent,
    NavbarComponent,
    SettingsComponent,
    TransactionComponent,
    TransactionCardComponent,
    LoaderComponent,
    ObjKeysPipe
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
    StorageServiceModule,
    MomentModule,
    MultiselectDropdownModule
  ],
  entryComponents: [
    SettingsComponent,
    TransactionComponent
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
