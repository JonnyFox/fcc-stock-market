import { StockService } from '../services/stock.service';
import { Controller, Get, Post, Put, Delete } from 'inversify-express-utils';
import { injectable } from 'inversify';
import { Request, Response } from 'express';
import { StockRequest, StockResponse } from '../models';


@injectable()
@Controller('/api/stocks')
export class StockController {

    constructor(private stockService: StockService) { }

    @Get('/tickers/:search')
    public async tickers(request:Request): Promise<any> { 
        return this.stockService.getTickers(request.params.search);
    }    

    @Post('')
    public async post(request: Request): Promise<StockResponse> {
        let requestBody = <StockRequest>request.body;
        return this.stockService.getStocks(requestBody.tickers, requestBody.from, requestBody.to);
    }
}
