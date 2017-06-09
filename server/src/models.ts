export interface StockRequest {
    tickers: string[];
    from: string;
    to: string;
}

export interface StockResponse {
    ticker: string;
    date: string;
    volume: number;
}

export interface Ticker {
    name: string;
    ticker: string;
    location: string;
}

export class WsMessage {
    type: string;
    data: any;
}