import { WsMessages } from '../../../server/src/ws-messages.enum';
import { WebSocketService } from '../shared/websocket.service';
import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';

import { Ticker, WsMessage } from '../../../server/src/models';
import { StockService } from '../shared/stock.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

    isAlive = true;

    public tickerControl: FormControl;

    public filteredTickers: Observable<Ticker[]>;

    public tickers: Ticker[];

    private ws: Subject<MessageEvent>;

    constructor(stockService: StockService, webSocketService: WebSocketService) {
        this.tickerControl = new FormControl();

        this.filteredTickers = this.tickerControl
            .valueChanges
            .takeWhile(() => this.isAlive)
            .filter((query: string) => query !== null && query !== '')
            .debounceTime(250)
            .distinctUntilChanged()
            .switchMap((query: string) => stockService.getTickers(query));

        this.ws = webSocketService
            .connect('ws://localhost:8999/');

        this.ws.subscribe((message: MessageEvent) => {
            let messageData = <WsMessage> JSON.parse(message.data);

            if (messageData.type === WsMessages[WsMessages.GetTickers]) {
                this.tickers = messageData.data;
            }
        });
    }

    public addTicker() {
        this.ws.next(<any>{ type: WsMessages[WsMessages.AddTicker], data: this.tickerControl.value });
    }

    public ngOnDestroy() {
        this.isAlive = false;
    }
}
