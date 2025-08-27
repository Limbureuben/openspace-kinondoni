import { CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule, provideZoneChangeDetection } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharingRoutingModule } from './sharing-routing.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { RegisterComponent } from './register/register.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';  // Import MatSelectModule
import { MatOptionModule } from '@angular/material/core';
import { TranslateModule, TranslateLoader, TranslateModuleConfig } from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, provideHttpClient} from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { CommonHeaderComponent } from './common-header/common-header.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharingprofileComponent } from './sharingprofile/sharingprofile.component';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    HomepageComponent,
    RegisterComponent,
    CommonHeaderComponent,
    SharingprofileComponent,
  ],
  imports: [
    CommonModule,
    SharingRoutingModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    ToastrModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatOptionModule,
    TranslateModule,
    MatMenuModule,
    MatDialogModule,
    MatTableModule
  ],

  exports: [
    FooterComponent,
    HeaderComponent
  ]
})
export class SharingModule {
}
