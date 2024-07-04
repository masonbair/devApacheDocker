import { Component, OnInit } from '@angular/core';
import { MacrosService } from 'src/app/services/flask/macros/macros.service';
//import {MatInputModule} from '@angular/material/input';
//import {MatSelectModule} from '@angular/material/select';
//import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-imagejs',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.css']
  //imports: [FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule],
})
export class ImageGalleryComponent implements OnInit {
    filenames: string[] = [];
    selected: boolean = false;
    selected_index: number[] = [];

    constructor(private _macrosService: MacrosService) { }

    ngOnInit(): void {
        const assetsPath = '/static/assets'; 
        var context = this;

        context = this;
        var temp;
        //This gathers all the data from the folder asset class
        fetch(assetsPath)
        .then(response => response.text())
        .then(text => {
            //These help to filter the results to get them in the right form we need
            temp = text.split('\n').filter(line => line.trim() !== '');
            var pattern = "/icons/image2.gif";
            temp = temp.filter(function(str) { return str.indexOf(pattern) !== -1})
            var hold;
            var final = [];
            console.log(temp.length)
            for(var i = 0; i < temp.length; ++i){
                hold = temp;
                hold = hold[i].split('>');
                console.log(hold);
                hold = hold.filter(function(str) { return str.indexOf(".jpg") !== -1});
                if(hold.length > 1){
                    final.push("/static/assets/" + hold[1].substring(0, hold[1].length - 3));
                }
            }
            this.filenames = final;
            console.log("Loading Images: " + this.filenames);
        })
        .catch(error => console.error('Error loading images:', error));
    }

    loadImagej(image: string){
        if(image == null){
            image = "null";
        }
        this._macrosService.getImagejOpen(image);
    }
    updateToXpra(){
        console.log("Sending to XPRA");
        this._macrosService.getXpraServer();
      }

    currentSelectedImage(image_index: number){
        var index = this.selected_index.indexOf(image_index);
        if(index == -1){
            this.selected_index.push(image_index);

            console.log("push:" + this.selected_index);
        }else{
            this.selected_index.splice(index, 1);
            console.log("splice: "+ index + " | " + this.selected_index);
        }
    }



}