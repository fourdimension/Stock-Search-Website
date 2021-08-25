import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { SearchComponent } from './search/search.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatButtonModule} from '@angular/material/button';
import { HttpClientModule} from '@angular/common/http';
import { DetailComponent } from './search/detail/detail.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { TabsComponent } from './search/detail/tabs/tabs.component';
import { TabComponent } from './search/detail/tabs/tab.component';
import { MatTabsModule} from '@angular/material/tabs';
import { MatCardModule} from '@angular/material/card';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    routingComponents,
    FooterComponent,
    SearchComponent,
    DetailComponent,
    TabsComponent,
    TabComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    HttpClientModule,
    HighchartsChartModule,
    MatTabsModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
