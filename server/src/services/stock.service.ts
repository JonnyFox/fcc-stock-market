import { StockValue, Ticker } from '../models';
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

    private _monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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

    public getStocks(ticker: string, from: Date, to: Date): Promise<StockValue[]> {
        const requestUrl = `https://www.quandl.com/api/v3/datatables/WIKI/PRICES.json?date.gte=${this.getDate(from)}&date.lt=${this.getDate(to)}&ticker=${ticker}&qopts.columns=date,volume&api_key=${this.configService.quandlApi.key}`;
            return new Promise<StockValue[]>((resolve, reject) => {
            request.get(requestUrl)
                .then(message => {
                    let result = JSON.parse(message);
                    let data: [[string, number]] = result.datatable.data;

                    let reducedData = data.map(el => {
                            return {
                                date: new Date(el[0]),
                                volume: el[1]
                            };
                        })
                        .filter(st => st.date.getDate() === 1)
                        .map(el => {
                            return {
                                date: `${this._monthNames[el.date.getMonth()]} ${el.date.getFullYear()}`,
                                volume: el.volume
                            }
                        });

                    resolve(reducedData);
                });
        });
    }

    private getDate(date: Date): string {
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
