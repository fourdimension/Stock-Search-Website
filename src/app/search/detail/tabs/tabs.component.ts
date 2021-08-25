/**
 * The main component that renders single TabComponent
 * instances.
 */

import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  ViewChild,
  ComponentFactoryResolver,
  ViewContainerRef,
  Input
} from '@angular/core';

import { TabComponent } from './tab.component';

@Component({
  selector: 'my-tabs',
  template: `
  <div class = "detail-bottom-container">
    <ul class="nav nav-justified">
      <li class = "nav-item" *ngFor="let tab of tabs" (click)="selectTab(tab)" [class.active]="tab.active">
        <a class = "nav-link" href="localhost:4200/details/{{ticker}}">{{tab.title}}</a>
      </li>
    </ul>
    <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
.detail-bottom-container{
    width: 80%;
    margin: auto;
}
.detail-bottom-container a:hover{
  background-color: white;
}
.detail-bottom-container a{
    border-bottom: 1px solid #eeedeb;
    color:#b1ada8;
}


.detail-bottom-container li.active{
  border-bottom:2px solid #6f4ffb;
  background-color:white  
}
    `
  ]
})
export class TabsComponent implements AfterContentInit {

  @Input() public ticker;
  
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  
  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    let activeTabs = this.tabs.filter((tab)=>tab.active);
    
    // if there is no active tab set, activate the first
    if(activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }
  
  selectTab(tab: TabComponent){
    // deactivate all tabs
    this.tabs.toArray().forEach(tab => tab.active = false);
    
    // activate the tab the user has clicked on.
    tab.active = true;
  }
}
