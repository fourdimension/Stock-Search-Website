import { Component, OnInit, ElementRef,ViewChild } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { SearchService } from '../../search/search.service';
import { dailyPriceSearch, DailySearch, historicalSearch, LatestPriceSearch, NewsSearch,PortfolioList } from '../search';
import * as Highcharts from "highcharts/highstock";
import { Options } from "highcharts/highstock";
import { FormControl } from '@angular/forms';
import { interval, Subscription,Observable, from, of } from 'rxjs';
import { mergeMap,startWith } from "rxjs/operators";
// import { DataService } from "./data.service";


declare var require: any;


import IndicatorsCore from "highcharts/indicators/indicators";
import { noUndefined } from '@angular/compiler/src/util';

IndicatorsCore(Highcharts);
import vbp from 'highcharts/indicators/volume-by-price';
import { stringify } from 'querystring';

IndicatorsCore(Highcharts);
vbp(Highcharts);



@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  providers: [SearchService]
})



export class DetailComponent implements OnInit {

  private subscription : Subscription;
  public ticker;
  public lastWorkingDay:string;
  public ClosedTime:string;
  public dailyList:DailySearch;
  public latestPriceList:LatestPriceSearch;
  public marketList:PortfolioList;
  public curTime;
  public newsTime:string;
  public openStatus:boolean;
  public newsList:NewsSearch;
  public dailyPriceList=[];

  public historicalPriceList=[];
  public ohlc = [];
  public volume = []; 

  public updateDailyFlag = false;
  public updateHistoryFlag = false;

  public daily_data_price=[];
  star_clicked = false;
  increase = true;  // Stock price increases or not

  WatchListKey ="Watch";
  BuyListKey = "Buy";

  watchList={}; // Create a list to store watchList stock names in the localStorage. Key = "names". 
  buyList;
  totalValue:string = "0.00";
  marketPrices:PortfolioList;
  temp_price;

  newsIdx:number;

  dailyChartOptions:Options;
  historicalOptions:Options;

  // @ViewChild('stockQuantity') stockQuantity:ElementRef;
  stockQuantity:number;
  myControl: FormControl = new FormControl();

  message:string; // data sent to Portfolio and Watchlist

  constructor(private route: ActivatedRoute, private _searchService: SearchService) { }

  ngOnInit(): void {
    this.watchList = JSON.parse(localStorage.getItem(this.WatchListKey)); 
    this.ticker =  this.route.snapshot.paramMap.get('ticker');
    if(this.watchList == null){
      this.star_clicked = false;
      this.watchList = {};
    }else{
      if(this.ticker in this.watchList){
        this.star_clicked = true;
      }else{
        this.star_clicked = false;
      }
    }
    console.log("Init WatchList is :\n"+JSON.stringify(this.watchList));
    console.log("check watchList star clicked:\n"+ this.star_clicked);
    this.myControl.valueChanges.subscribe(
      num =>{
        if(num<=0){
          (<HTMLInputElement> document.getElementById("buy-btn")).disabled = true;
        }else{
          (<HTMLInputElement> document.getElementById("buy-btn")).disabled = false;
        }
        this.stockQuantity = parseInt(num);
        this.totalValue = (parseFloat(this.latestPriceList.last) * this.stockQuantity).toFixed(2);
        if(parseFloat(this.totalValue)<=0) {
          this.totalValue = "0.00";
        }
      }
    );


    this._searchService.getDaily(this.ticker).subscribe(
      data => {
        this.dailyList = data;
        //console.log("data\n" + data);
        console.log("daily name is :" + data.name);
        //console.log("dailyList\n" + this.dailyList);
      });
      

      interval(15000)
      .pipe(
          startWith(0),mergeMap(() => this._searchService.getLatestPrice(this.ticker))
      )
      .subscribe(data =>{
        console.log("update....");
        this.latestPriceList = data;
        this.message = JSON.stringify(data);
        //console.log("Latest price data is:\n" + data);
        //console.log("PrevClose is: \n" + data['prevClose']);

        //Show current time
      let date =  new Date();
      // let utcDate = new Date(date.toUTCString());
      // utcDate.setHours(utcDate.getHours()-8);
      // let usDate = new Date(utcDate);
      this.curTime = 
      date.getFullYear() + "-" +
      ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
      ("00" + date.getDate()).slice(-2) + "-" +
      ("00" + date.getHours()).slice(-2) + ":" +
      ("00" + date.getMinutes()).slice(-2) + ":" +
      ("00" + date.getSeconds()).slice(-2);

      let stampDate = new Date(this.latestPriceList.timestamp);
      //Convert to PST time
      // let _utcDate = new Date(stampDate.toUTCString());
      // _utcDate.setHours(_utcDate.getHours()-8);
      // let _usDate = new Date(_utcDate);

      this.ClosedTime = 
      ("00" + (stampDate.getMonth() + 1)).slice(-2) + "-" +
      ("00" + stampDate.getDate()).slice(-2) + "-" +
      ("00" + stampDate.getHours()).slice(-2) + ":" +
      ("00" + stampDate.getMinutes()).slice(-2) + ":" +
      ("00" + stampDate.getSeconds()).slice(-2);

      this.lastWorkingDay = stampDate.getFullYear() + "-" +
      ("00" + (stampDate.getMonth() + 1)).slice(-2) + "-" +
      ("00" + stampDate.getDate()).slice(-2);

      //check if the stock increases
      this.increase = parseFloat(this.latestPriceList.last)-parseFloat(this.latestPriceList.prevClose)>0? true: false;
      let elem = document.getElementsByClassName('data_hidden') as HTMLCollectionOf<HTMLElement>;
      if(this.increase){
        for(let i =0; i<elem.length; i++){
          elem[i].style.display = "none";
        }
      }else{
        for(let i =0; i<elem.length; i++){
          elem[i].style.display = "display";
        }
      }
      let timeDiff = Math.abs(stampDate.getTime()-date.getTime())/1000;
      if(timeDiff < 60){
        this.openStatus = true;
      } else{
        this.openStatus = false;
      }

      this._searchService.getDailyPrice(this.lastWorkingDay, this.ticker).subscribe(
        dailydata =>{
          this.dailyPriceList = dailydata;
          this.daily_data_price = [];
          
          for (let i = 0; i<this.dailyPriceList.length; i++){
            let timesecond = (new Date(dailydata[i].date)).getTime();
            this.daily_data_price.push([timesecond,dailydata[i].close]);
          }
          // let timesecond = (new Date(dailydata[0].date)).getTime();
          // this.daily_data_price.push([timesecond,dailydata[0].close]);

          //this.handleDailyUpdate();

          //console.log("dailyPriceList:\n"+this.daily_data_price[0][1]);

          this.dailyChartOptions = {
            title:{
              text:this.ticker
            },
            rangeSelector: {
              inputEnabled: false,
              buttonTheme: {
                  visibility: 'hidden'
              },
              labelStyle: {
                  visibility: 'hidden'
              }
          },
            series: [
              {
                name:this.ticker,
                color:'green',
                type: 'line',
                data: this.daily_data_price
              }
            ]
      
          };
          
        }
      );
      });
    

    this._searchService.getNews(this.ticker).subscribe(
      data => {
        this.newsList = data;
      }
    );

    

    this._searchService.getHistoryPrice(this.ticker).subscribe(
      data =>{
        this.historicalPriceList = data;
        this.ohlc = [];
        this.volume = [];
        let dataLength = data.length;
        for (let i=0; i<dataLength; i++){
          let datatime = (new Date(data[i].date)).getTime();
          this.ohlc.push([
            datatime,
            data[i].open,
            data[i].high,
            data[i].low,
            data[i].close
          ]);
          this.volume.push([
            datatime,
            data[i].volume
          ]);
        }
 
        this.historicalOptions = {
          title:{
            text: this.ticker + " Historical"
          },
          subtitle:{
            text: 'with SMA and Volume by Price technical indicators'
          },
          rangeSelector: {
            selected: 2
        },
    
        yAxis: [{
            startOnTick: false,
            endOnTick: false,
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'OHLC'
            },
            height: '60%',
            lineWidth: 2,
            resize: {
                enabled: true
            }
        }, {
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'Volume'
            },
            top: '65%',
            height: '35%',
            offset: 0,
            lineWidth: 2
        }],
    
        tooltip: {
            split: true
        },
    
        plotOptions: {
            series: {
                dataGrouping: {
                    units: [[
                      'week',                         // unit name
                      [1]                             // allowed multiples
                  ], [
                      'month',
                      [1, 2, 3, 4, 6]
                  ]]
                }
            }
        },
    
        series: [{
            type: 'candlestick',
            name: this.ticker,
            id: 'aapl',
            zIndex: 2,
            data: this.ohlc
        }, {
            type: 'column',
            name: 'Volume',
            id: 'volume',
            data: this.volume,
            yAxis: 1
        }, {
            type: 'vbp',
            linkedTo: 'aapl',
            params: {
                volumeSeriesID: 'volume'
            },
            dataLabels: {
                enabled: false
            },
            zoneLines: {
                enabled: false
            }
        }, {
            type: 'sma',
            linkedTo: 'aapl',
            zIndex: 1,
            marker: {
                enabled: false
            }
        }]
    };

        
      }
    );

    
  }

  Highcharts: typeof Highcharts = Highcharts;
 
  // dailyChartOptions :Options = {
  //    title:{
  //       text:"AAPL"
  //     },
  //   series: [
  //     {
  //       type: 'line',
  //       data: [1,2,4]
  //     }
  //   ]
  // };
  
  // handleDailyUpdate(){
  //   this.updateDailyFlag =false;

  // }


  // handleHistoryUpdate(){
  //   this.updateHistoryFlag = false;
    

  //   this.updateHistoryFlag =true;
    
  // }

  starClick(){

    this.star_clicked = !(this.star_clicked);
    console.log("Before starClicked:\n"+JSON.stringify(localStorage.getItem(this.WatchListKey)));
    // this.watchList = JSON.parse(localStorage.getItem(this.WatchListKey));

    if(this.star_clicked){
      this.InsertWatchList();
      console.log("Clicked ticker is:"+this.ticker);
      
      document.getElementById("remove-success-alert").style.display = "none";
      document.getElementById("add-success-alert").style.display = "block";
      console.log('retrived WatchList is: ', localStorage.getItem(this.WatchListKey));
    }else{
      this.DeleteWatchList(this.ticker);
      localStorage.setItem(this.WatchListKey, JSON.stringify(this.watchList));
      document.getElementById("add-success-alert").style.display = "none";
      document.getElementById("remove-success-alert").style.display = "block";
    }
    
    // console.log("this.star_clicked");
  }
  BuyStock(){ 
    //this.buyList = {"AAPL":{name:"Apple Inc",quantity:400,cost:3000},"NVDA":{name:"Apple Inc",quantity:400,cost:3000}}
    this.buyList = JSON.parse(localStorage.getItem('Buy'));
    if(this.buyList == null){
      this.buyList = {};
    }
    console.log("Before Buy Stock:"+JSON.stringify(this.buyList));
    let keys = Object.keys(this.buyList);
    if(this.ticker in this.buyList){
      console.log("this.stockQuantity is:"+this.stockQuantity);
      console.log("this.buyList.quantity is:"+parseInt(this.buyList[this.ticker].quantity));
      this.buyList[this.ticker].quantity = this.stockQuantity + parseInt(this.buyList[this.ticker].quantity);
      this.buyList[this.ticker].cost = parseFloat(this.totalValue)+parseFloat(this.buyList[this.ticker].cost);
      console.log(this.ticker+" in buyList");
      console.log(JSON.stringify(this.buyList));
      localStorage.setItem(this.BuyListKey,JSON.stringify(this.buyList));
      return;
    }
    this.buyList[this.ticker] = {name:this.dailyList.name, quantity:this.stockQuantity,cost:this.totalValue};

    console.log(this.ticker + " not in the buyList");
    console.log("After buy, Buy List is:\n"+JSON.stringify(this.buyList));
    localStorage.setItem(this.BuyListKey,JSON.stringify(this.buyList));

  }

  
  FinishBuyStockBtn(){
    this.BuyStock();
    
    document.getElementById("modalConfirmDelete").style.display = "none";
    document.getElementById("buy-success-alert").style.display = "block";
  }

  InsertWatchList(){
    let index = 0;
    // while(index < this.watchList.length){
    //   if(this.ticker.localeCompare(this.watchList[index])>0){
    //     index++;
    //   }
    // }
    this.watchList[this.ticker] = this.dailyList.name;
    //this.watchList.splice(index, 0, this.ticker:this.dailyList.name);
    console.log("after Insert: "+JSON.stringify(this.watchList,Object.keys(this.watchList).sort()));
    localStorage.setItem(this.WatchListKey,JSON.stringify(this.watchList,Object.keys(this.watchList).sort()));
  }

  DeleteWatchList(obj:string){
    const index = Object.keys(this.watchList).indexOf(obj);
    console.log("Delete index is :" +index);
    delete this.watchList[this.ticker];
    console.log("after delete: "+JSON.stringify(this.watchList));
  }

  CloseContainer(obj){
    obj.parentElement.style.display='none';
  }

  getNewsIndex(index:number){
    this.newsIdx = index;
    this.newsTimeConversion(this.newsList[index].publishedAt.substring(0,10));
  }

  newsTimeConversion(str:string){
    let timeDic = {"01":"January","02":"February", "03":"March","04":"April","05":"May","06":"June","07":"July","08":"August","09":"September","10":"October","11":"November","12":"December"};
    let year = str.substring(0,4);
    console.log("show year:"+year);
    let month = timeDic[str.substring(5,7)];
    console.log("show month:"+month);
    let day = str.substring(8,10);
    this.newsTime = month +" "+day +","+year;
    console.log("new Time is：\n"+this.newsTime);
  }

  CloseNewsBlock(){
    console.log("Close NewsBlock!");
    document.getElementById('newsModal').style.display = "none";
  }


}
