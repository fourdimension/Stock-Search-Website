
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs'
import { AutoSearch, dailyPriceSearch, DailySearch, historicalSearch, LatestPriceSearch, NewsSearch } from './search';
import { DetailComponent } from './detail/detail.component';


@Injectable()
export class SearchService{

    private _url: string = '';
    private startDate: string;

    constructor(private http: HttpClient){}

    getSearch(value): Observable<AutoSearch[]>{
        console.log(this._url + '/search/' + value);
        return this.http.get<AutoSearch[]>(this._url + '/search/' + value);
    }

   

    getLatestPriceList(value):Observable<any>{
        return this.http.get<any>(this._url + '/latestPricesList/' +value);
    }

    getLatestPrice(value): Observable<LatestPriceSearch>{
        console.log("line 29:" + this._url + '/latestPrices/' + value);
        let data = this.http.get(this._url + '/latestPrices/' + value);
        //console.log("latest Prices prevClose data: \n" + data['prevClose']);
        return this.http.get<LatestPriceSearch>(this._url + '/latestPrices/' + value);
    }

    getDaily(value): Observable<DailySearch>{
        //console.log("line 22:" + this._url + '/details/' + value);
        let data = this.http.get(this._url + '/detail/' + value);

        //console.log("check data:\n" + data);
        return this.http.get<DailySearch>(this._url + '/detail/' + value);
    }

    getNews(value): Observable<NewsSearch>{
        console.log("line 38:" + this._url + '/newsApi/' + value);
        let data = this.http.get(this._url + '/newsApi/' + value);
        return this.http.get<NewsSearch>(this._url + '/newsApi/' + value);
    }



    getDailyPrice(startDate, value):Observable<dailyPriceSearch[]>{
        let url = this._url + '/dailyChart/'+startDate + '/' + value;
        console.log("line44:" + url);
        return this.http.get<dailyPriceSearch[]>(url);
    }

    getHistoryPrice(value): Observable<historicalSearch[]>{
        let url = this._url + '/historical/' + value;
        console.log("historical url:" + url);
        return this.http.get<historicalSearch[]>(url);
    }
}