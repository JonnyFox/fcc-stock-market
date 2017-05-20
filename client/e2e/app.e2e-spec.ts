import { FccStockMarketPage } from './app.po';

describe('fcc-stock-market App', () => {
  let page: FccStockMarketPage;

  beforeEach(() => {
    page = new FccStockMarketPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
