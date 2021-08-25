import { Component, OnInit } from '@angular/core';
//import { DataService } from "../search/detail/data.service";
import { SearchService } from '../search/search.service';
import {LatestPriceSearch} from '../search/search';
import {Router} from '@angular/router';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
  providers: [SearchService]
})
export class WatchlistComponent implements OnInit {
  watchList;
  tickerList = [];
  nameList = [];
  ticker:string;
  latestPriceList:LatestPriceSearch[];
  listLength;
  constructor(private searchService: SearchService, public router:Router) { }
  

  ngOnInit(): void {
    // this.watchList = {"AAPL":"Apple Inc","AMZN":"Amazoncom Inc","NVDA":"NVDIA Corp"};
    // localStorage.setItem("Watch",JSON.stringify(this.watchList));
    console.log("ngOnInit Watch list is:\n"+JSON.stringify(localStorage.getItem("Watch")));
    this.watchList = JSON.parse(localStorage.getItem("Watch"));
    if(this.watchList == null){
      this.watchList = {};
    }
    this.tickerList = Object.keys(this.watchList);
    this.nameList = Object.values(this.watchList);
    if(this.tickerList.length!=0){
      this.searchService.getLatestPriceList(this.tickerList.join(',')).subscribe(
        data => { 
          console.log(typeof(data));
          this.latestPriceList = data;
          //this.latestPriceList = JSON.parse(data);
          this.listLength = this.latestPriceList.length;
      });
    }
   
    
  }
  CloseContainer(obj,index){
    obj.style.display = "none";
    console.log(typeof(this.watchList));
    delete this.watchList[this.tickerList[index]];
    console.log(JSON.stringify(this.watchList));
    localStorage.setItem("Watch",JSON.stringify(this.watchList));
  }

  routeToStock(idx:number){
    
    this.router.navigate(['/details/'+this.tickerList[idx]]);

  }
  
}
