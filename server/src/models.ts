export interface StockRequest {
    tickers: string[];
    from: string;
    to: string;
}

export interface Ticker {
    name: string;
    ticker: string;
    location: string;
    stocks: StockValue[];
    colors: number[];
}

export class StockValue { 
    date: string;
    volume: number;
}

export class WsMessage {
    type: string;
    data: any;
}