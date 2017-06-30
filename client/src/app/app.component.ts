import { WsMessages } from '../../../server/src/ws-messages.enum';
import { WebSocketService } from '../shared/websocket.service';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';

import { Ticker, WsMessage } from '../../../server/src/models';
import { StockService } from '../shared/stock.service';
import { MdAutocompleteTrigger } from "@angular/material";
import { BaseChartDirective } from "ng2-charts";
import { environment } from "environments/environment";

interface ChartData {
    data: number[];
    label: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

    isAlive = true;

    public tickerControl: FormControl;

    public selectedTicker: Ticker;

    public filteredTickers: Observable<Ticker[]>;

    public tickers: Ticker[];

    public liveUsersCount: number;

    public liveUsersCountString: string;

    @ViewChild('testChart') chart: BaseChartDirective;

    public lineChartData: ChartData[] = [];
    public lineChartLabels: string[] = [];
    public lineChartOptions: any = {
        responsive: true
    };

    private ws: Subject<MessageEvent>;

    constructor(stockService: StockService, webSocketService: WebSocketService) {
        this.tickerControl = new FormControl();

        this.filteredTickers = this.tickerControl
            .valueChanges
            .takeWhile(() => this.isAlive)
            .debounceTime(250)
            .distinctUntilChanged()
            .switchMap((query: string) => {
                return query === '' ? Observable.of([]) : stockService.getTickers(query);
            });

        this.ws = webSocketService
            .connect(environment.appUrl.replace(/https?/, 'wss'));

        let chart = this.chart;

        this.ws.subscribe((message: MessageEvent) => {
            let messageData = <WsMessage>JSON.parse(message.data);

            if (messageData.type === WsMessages[WsMessages.GetTickers]) {
                let tickers: Ticker[] = messageData.data;
                this.clearData();
                tickers.forEach((i, index) => {
                    this.lineChartData.push({ data: i.stocks.map(st => st.volume), label: i.ticker });
                    i.colors = BaseChartDirective.defaultColors[index % 12];
                });
                if (!this.lineChartLabels.length && tickers.length) {
                    this.lineChartLabels = tickers[0].stocks.map(st => st.date);
                }
                this.tickers = messageData.data;
                setTimeout(() => {
                    this.changeData();
                }, 0);
            }

            if (messageData.type === WsMessages[WsMessages.GetUsers]) {
                let messageData = <WsMessage>JSON.parse(message.data);
                if (messageData && !!messageData.data) {
                    this.liveUsersCount = +messageData.data;
                    this.liveUsersCountString = `${this.liveUsersCount} live user${this.liveUsersCount > 1 ? 's' : ''}`;
                }
            }
        });
    }

    private clearData(): void {
        this.lineChartLabels = new Array<string>();
        this.lineChartData = new Array<ChartData>();
    }

    public onSelectTicker(ticker) {
        this.selectedTicker = ticker;
    }

    public addTicker() {
        this.ws.next(<any>{ type: WsMessages[WsMessages.AddTicker], data: this.selectedTicker });
        this.selectedTicker = null;
        this.tickerControl.reset();
    }

    public removeTicker(ticker: Ticker) {
        this.ws.next(<any>{ type: WsMessages[WsMessages.RemoveTicker], data: ticker });
    }

    public changeData() {
        if (this.chart) {
            (<any>this.chart).refresh();
        }
    }

    public getBorderStyle(ticker: Ticker) {
        return `rgb(${ticker.colors.join(',')})`;
    }

    public ngOnDestroy() {
        this.isAlive = false;
    }
}
