import { Component, OnInit } from '@angular/core';
import { MacrosService } from 'src/app/services/flask/macros/macros.service';
import { FolderService } from 'src/app/services/flask/folder-service/folder.service';

interface Type{
    value: string;
    viewValue: string;
}



@Component({
  selector: 'app-imagejs',
  templateUrl: 'image-gallery.component.html',
  styleUrls: ['image-gallery.component.css'],
})
export class ImageGalleryComponent implements OnInit {
    filenames: string[] = [];
    selected: boolean = false;
    selected_index: number[] = [];
    loaded_images: string[] = [];

    fileExists: Boolean = true;

    selectedType: string = "";
    fileTypes: Type[] = [
        {value: '.jpg', viewValue: 'JPG'},
        {value: '.tif', viewValue: 'TIF'},
        {value: '.oif', viewValue: 'OIF'}
    ]

    constructor(private _macrosService: MacrosService, private _folderServer: FolderService) { }

    ngOnInit(): void {
        this.fileExists = this._folderServer.fileExists("/lock/imagej_lock.txt");
        console.log(this.fileExists.valueOf());
        this.selectedType = ".jpg";
        this.readImages();

    }

    readImages(){
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
            
            for(var i = 0; i < temp.length; ++i){
                hold = temp;
                hold = hold[i].split('>');
                console.log(hold);
                //We start at hold[1] because hold[0] is an unneccessary string value
                var imageName = hold[6].substring(0, hold[6].length - 3);

                //--------------------------
                //This code block is used for checking all the valid images and there file endings
                //If a file ending exists that isnt in the fileTypes, then it will be added automatically
                var fileEnding  = imageName.substring(imageName.length-4, imageName.length);
                var valueCount = 0;
                for(var f = 0; f < this.fileTypes.length; ++f){
                    if(fileEnding == this.fileTypes[f].value){
                        valueCount++;
                    }
                }
                if(valueCount == 0){
                    const use: Type = {value: fileEnding, viewValue: fileEnding.substring(1, fileEnding.length).toUpperCase()};
                    this.fileTypes.push(use);
                }
                //-----------------------------------
                for(var w = 0; w < hold.length; ++w){
                    this.loaded_images.push(hold[w]);
                }
                
            }
            this.loadPage();
            
            console.log("Loading Images: " + this.loaded_images);
        })
        .catch(error => console.error('Error loading images:', error));
    }

    loadPage(){
        this.fileExists = this._folderServer.fileExists("/lock/imagej_lock.txt")
        setTimeout(() => {},5000);
        console.log(this.fileExists.valueOf());
        console.log("Loading Images");
        var filterType = this.selectedType;
        var filtered_images = [];
        var final = [];

        filtered_images = this.loaded_images.filter(function(str) { return str.indexOf(filterType) !== -1});

        for(var i = 1; i<filtered_images.length; i=i+2){
            final.push("/static/assets/" + filtered_images[i].substring(0, filtered_images[i].length-3));
        }
        
        this.filenames = final;
    }

    loadImagej(images: string[], indexes: number[]){
        var selected_images = [];
        if(images[0] == null){
            selected_images.push("null");
        }else{
            for(var i = 0; i < indexes.length; ++i){
                selected_images[i] = images[indexes[i]];
            }
        }
        this._macrosService.getImagejOpen(selected_images);
    }
    updateToXpra(){
        console.log("Sending to XPRA");
        this._macrosService.getXpraServer();
      }

    currentSelectedImage(image_index: number){
        var index = this.selected_index.indexOf(image_index);
        if(index == -1){
            this.selected_index.push(image_index);
        }else{
            this.selected_index.splice(index, 1);
        }
    }

    selectType(event: Event) {
        this.selectedType = (event.target as HTMLSelectElement).value;
      }



}