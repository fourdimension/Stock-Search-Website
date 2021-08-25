import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
//import { DataService } from "../search/detail/data.service";
import { SearchService } from '../search/search.service';
import {LatestPriceSearch} from '../search/search';
import {PortfolioList} from '../search/search';
import { FormControl } from '@angular/forms';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
  providers: [SearchService]
})
export class PortfolioComponent implements OnInit {
  buy_sell_btn_text:string = "";
  totalValue:string = "0.00";
  stockQuantity:number;
  latestPriceList:LatestPriceSearch[];

  index:number = 0;
  buyList;
  TickerList = [];
  //marketPrices:PortfolioList[];
  temp_price;
  // totalCostList=[];
  // quantityList=[]; 
  
  listLength;

  myControl: FormControl = new FormControl();

  constructor(private searchService: SearchService) { }




  ngOnInit(): void {
    //this.buyList = {"AAPL":{name:"Apple Inc",quantity:2,cost:3000},"NVDA":{name:"NVDIA Inc",quantity:4,cost:5000}}
    console.log("Before Initialization:\n"+localStorage.getItem("Buy"));
    this.buyList = JSON.parse(localStorage.getItem("Buy"));
    if(this.buyList == null){
      document.getElementById('NoneStock').style.display = "block";
      this.buyList = {};
    }else{
      document.getElementById('NoneStock').style.display = "none";
    }
    console.log("After Initialization, buylist is:\n"+JSON.stringify(this.buyList));
    this.TickerList = Object.keys(this.buyList).sort();
    this.searchService.getLatestPriceList(this.TickerList.join(',')).subscribe(
      data => { 
        this.latestPriceList = data;
        this.listLength = this.latestPriceList.length;
        //console.log("LatestPriceList Init:\n"+JSON.stringify(this.latestPriceList));
        //console.log("latestPriceList 0 last is:\n"+this.latestPriceList[0].last);
    });




    this.myControl.valueChanges.subscribe(
      num =>{
        // Buy button clicked
        this.stockQuantity = parseInt(num);
        let num_buy = parseInt(num);
        this.totalValue = (parseFloat(this.latestPriceList[this.index].last) * num_buy).toFixed(2);
        if(this.buy_sell_btn_text == "Buy"){
          console.log("Buy button clicked");
          if(num<=0){
            (<HTMLInputElement> document.getElementById("buy_sell_btn")).disabled = true;
          }else{
            (<HTMLInputElement> document.getElementById("buy_sell_btn")).disabled = false;
          }

          if(this.stockQuantity<=0) {
            this.totalValue = "0.00";
          }
          // Sell button clicked
        }else{
          if(num<=0 || num > parseInt(this.buyList[this.TickerList[this.index]].quantity)){
            (<HTMLInputElement> document.getElementById("buy_sell_btn")).disabled = true;
          }else{
            (<HTMLInputElement> document.getElementById("buy_sell_btn")).disabled = false;
          }


        }

        
      }
    );






  

   
  }

  // BuyListInitialize(){
  //   this.nameList = Object.keys(this.nameList);
  //   for(let i =0; i<this.buyList.length;i++){
  //     this.temp_price = Object.values(this.buyList[i])[0];
  //     this.marketPrices.push(this.temp_price);
  //   }

  // }


  ChangeBtnText(obj:string, index){
    // console.log("Change Button Clicked");
    // console.log("Click Button = "+ obj);
    console.log("buy_sell_btn changed");
    this.index = index;
    this.buy_sell_btn_text = obj;
    console.log("Befor:BuyList is\n"+JSON.stringify(this.buyList));
  }

  Transaction(){
    if(this.buy_sell_btn_text == "Buy"){
      // finish buy transaction
      this.buyList[this.TickerList[this.index]].quantity=this.stockQuantity+parseInt(this.buyList[this.TickerList[this.index]].quantity);
      this.buyList[this.TickerList[this.index]].cost=parseFloat(this.totalValue)+parseFloat(this.buyList[this.TickerList[this.index]].cost);
    }else{
      // Finish Sell transaction
      this.buyList[this.TickerList[this.index]].quantity=parseInt(this.buyList[this.TickerList[this.index]].quantity)-this.stockQuantity;
      this.buyList[this.TickerList[this.index]].cost=parseFloat(this.buyList[this.TickerList[this.index]].cost)-parseFloat(this.totalValue);
    }

    if(parseFloat(this.buyList[this.TickerList[this.index]].quantity) == 0){
      delete this.buyList[this.TickerList[this.index]];
      this.TickerList.splice(this.index, 1);
      localStorage.setItem("Buy",JSON.stringify(this.buyList));
    }
    document.getElementById("modalConfirmDelete").style.display = "none";
    console.log("after Transaction:\n"+JSON.stringify(this.buyList));
    if(this.buyList.length ==0){
      document.getElementById('NoneStock').style.display = "none";
    }
  }
}
