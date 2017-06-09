import { StockResponse, Ticker } from '../../../server/src/models';
import { BaseService } from './base.service';
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { environment } from "environments/environment";

@Injectable()
export class StockService extends BaseService<StockResponse> {

    constructor(protected http: Http) {
        super(http, environment.appUrl + '/api/stocks')
    }

    public getTickers(query: string): Observable<Ticker[]> {
        return this.getGeneric<Ticker[]>(`/tickers/${query}`);
    }
}