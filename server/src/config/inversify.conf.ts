import 'reflect-metadata';
import { Container } from 'inversify';
import { interfaces, Controller, TYPE } from 'inversify-express-utils';
import { ConfigService, StockService } from '../services';
import { StockController } from "../controllers/stock.controller";

let container = new Container();
container.bind<ConfigService>(ConfigService).toSelf().inSingletonScope();
container.bind<StockService>(StockService).toSelf().inSingletonScope();
container.bind<interfaces.Controller>(TYPE.Controller).to(StockController).whenTargetNamed('StockController');
export default container;
