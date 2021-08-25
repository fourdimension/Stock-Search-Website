import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WatchlistComponent} from './watchlist/watchlist.component'
import { PortfolioComponent} from './portfolio/portfolio.component'
import { SearchComponent } from './search/search.component'
import { DetailComponent} from './search/detail/detail.component'

const routes: Routes = [
  {path:'details/:ticker', component: DetailComponent},
  {path:'Watchlist', component: WatchlistComponent},
  {path:'Portfolio', component: PortfolioComponent},
  {path:'',  component: SearchComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [DetailComponent,WatchlistComponent, PortfolioComponent,SearchComponent]