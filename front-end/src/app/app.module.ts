import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import  { HttpClientModule} from '@angular/common/http'; //very important for http requests
import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

//Routes
import { APP_ROUTING } from './app.routes';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { ImagejsComponent } from './components/imagejs/imagejs.component';
import { FilePickerComponent } from './components/file-picker/file-picker.component';

import { FolderService } from './services/flask/folder-service/folder.service';
import { MacroResultComponent } from './components/macros/macro-result/macro-result.component';
import { MacroListComponent } from './components/macro-list/macro-list.component';
import { MacroHomeComponent } from './components/macro-home/macro-home.component';
import { MiscButtonsComponent } from './components/misc-buttons/misc-buttons.component';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';

//services
import { SharedMacroService } from 'src/app/services/macros/shared-macro.service';
import { MacrojobComponent } from './components/macros/macrojob/macrojob.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ImagejsComponent,
    FilePickerComponent,
    MacroResultComponent,
    MacroListComponent,
    MacroHomeComponent,
    MacrojobComponent,
    MiscButtonsComponent,
    FileUploadComponent,
    ImageGalleryComponent,
  ],
  imports: [
    //third party imports first
    BrowserModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule, 
    MatSelectModule, 
    MatInputModule,
    //my imports second
    APP_ROUTING,
    AppRoutingModule
  ],
  providers: [
    FolderService,
    SharedMacroService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
