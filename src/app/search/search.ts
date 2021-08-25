export interface AutoSearch{
    ticker: string
    name: string,
}

export interface DailySearch{
    ticker: string,
    name: string,   
    description: string,
    startDate: string,
    exchangeCode: string
}

export interface LatestPriceSearch{
    prevClose: string,
    mid: string,
    open: string,
    askPrice: string,
    low: string,
    ticker: string,
    timestamp: string,
    last: string,
    high: string,
    askSize: string,
    bidPrice: string,
    bidSize: string,
    volume: string
}

export interface NewsSearch{
    source: string,
    publishedAt: string,
    title: string,
    description: string,
    url: string
    urlToImage: string
}

export interface dailyPriceSearch{
    date: string,
    close: string,
    high: string,
    low: string,
    open: string
}

export interface historicalSearch{
    date: string,
    close: string,
    high: string,
    low: string,
    open: string,
    volume: string
}

export interface PortfolioList{
        name:string,
        quantity: number,
        cost: number
    
    
}