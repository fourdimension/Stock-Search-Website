import { Component, OnInit, ViewChild, ElementRef, DebugElement } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { SearchService } from './search.service';



@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [SearchService]
})

export class SearchComponent implements OnInit {
  @ViewChild('SearchInput') searchInput:ElementRef;
  

  constructor(private _searchService: SearchService) { }


  public companyList = [];

  myControl: FormControl = new FormControl();
  filteredOptions: Observable<string[]>;
  

  ngOnInit(): void {
    this.myControl.valueChanges.subscribe(
      term =>{
        if(term !=''){
          console.log("intput is:"+term);
          this._searchService.getSearch(term).subscribe(
            data => {
              this.companyList = [];
              let len = Math.min(data.length, 10);
              for (let i = 0; i < len; i++){
                const input =  data[i].ticker + '|' + data[i].name;
                this.companyList.push(input);
                //console.log(input);
              }
              //console.log(this.companyList);
            });                                    
        }
      }
    );


  }



}
