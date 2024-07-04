import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ImagejsComponent } from './components/imagejs/imagejs.component';
import { FilePickerComponent } from './components/file-picker/file-picker.component';
import { MacroResultComponent } from './components/macros/macro-result/macro-result.component';
import { MacroHomeComponent } from './components/macro-home/macro-home.component';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';


const APP_ROUTES: Routes = [
    {path: 'home', component: HomeComponent },
    {path: 'imagejs', component: ImagejsComponent },
    {path: 'macro', component: MacroHomeComponent },
    {path: 'macroResult', component:MacroResultComponent},
    {path: 'gallery', component:ImageGalleryComponent},
    {path: '**', pathMatch: 'full', redirectTo: 'home'}
]

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, {useHash:true});        //importante usar has true para que las rutas funcionen con hashes,
                                                                                    //es mas eficiente y soportado por navegadores web, para enviar parametros
                                                                                    //<base href="/"> en el index para que funcione