import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from 'src/services/user';
import { Routes, RouterModule } from '@angular/router';
import { UserPage } from 'src/pages/user/user.component';

const appRoutes: Routes = [
  { path : '', component: UserPage, pathMatch: 'full'},
];

@NgModule({
  declarations: [
    AppComponent,
    UserPage
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
