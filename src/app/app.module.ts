import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgUploaderModule } from 'ngx-uploader';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './common/pageNotFound/pageNotFound.component';
import { LoginComponent } from   './common/login/login.component';
import { RegisterComponent } from './common/register/register.component';

import { Chat } from './services/chat';

import { routing, appRoutingProviders } from './app.routing';

@NgModule({
  imports: [ BrowserModule, HttpModule, FormsModule, ReactiveFormsModule, NgUploaderModule, routing ],
  declarations: [ AppComponent, HomeComponent, PageNotFoundComponent, LoginComponent, RegisterComponent ],
  bootstrap:    [ AppComponent ],
  providers:    [ Chat, appRoutingProviders ]
})
export class AppModule { }
