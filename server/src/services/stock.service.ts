import { Ticker } from '../models';
import { ConfigService } from './config.service';
import { injectable } from 'inversify';
import * as request from 'request-promise';
import * as dateformat from 'dateformat';
import * as fs from 'fs';
import * as path from 'path';

@injectable()
export class StockService {
    constructor(private configService: ConfigService) { }

    private _tickers: Ticker[];

    public async getTickers(suggestion: string): Promise<Ticker[]> {

        if (!this._tickers || this._tickers.length == 0) { 
           this._tickers = await this.loadTickers();
        }

        let result = [];

        const suggestionRegex = new RegExp(`^${suggestion}`, 'gi');

        for (let i = 0; i < this._tickers.length; i++) {
            const element = this._tickers[i];
            if (suggestionRegex.test(element.name)) {
                result.push(element);
            }
            if (result.length == 10) break;
        }

        return result;
    }

    public getStocks(tickers: string[], from: string, to: string) {
        return request.get(`https://www.quandl.com/api/v3/datatables/WIKI/PRICES.json?date.gte=${this.getDate(from)}&date.lt=${this.getDate(to)}&ticker=${tickers.join(',')}&qopts.columns=ticker,date,volume&api_key=${this.configService.quandlApi.key}`);
    }

    private getDate(dateString: string): string {
        const date = new Date(dateString);
        return dateformat(date, 'yyyymmdd');
    }

    private loadTickers(): Promise<Ticker[]> {
        return new Promise<Ticker[]>((resolve, reject) => {
            const content = fs.readFile(path.join(__dirname, './tickers.json'), 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(JSON.parse(data));
            });
        });
    }
}
