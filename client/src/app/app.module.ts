import { WebSocketService } from '../shared/websocket.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdAutocompleteModule, MdInputModule, MdButtonModule } from '@angular/material';


import { AppRoutingModule } from './app-routing.module';
import { StockService } from '../shared/stock.service';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpModule,
        AppRoutingModule,
        MdAutocompleteModule,
        MdInputModule,
        MdButtonModule,
        BrowserAnimationsModule
    ],
    providers: [
        StockService,
        WebSocketService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
