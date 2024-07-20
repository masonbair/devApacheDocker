import { Component, OnInit, OnDestroy } from '@angular/core';
import { MacrosService } from 'src/app/services/flask/macros/macros.service';
import { FolderService } from 'src/app/services/flask/folder-service/folder.service';
import { Observable, interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface Type{
    value: string;
    viewValue: string;
}



@Component({
  selector: 'app-imagejs',
  templateUrl: 'image-gallery.component.html',
  styleUrls: ['image-gallery.component.css'],
})

//This classes main purpose is to be the Image Gallery on the webpage
export class ImageGalleryComponent implements OnInit {
    filenames: string[] = [];
    selected: boolean = false;
    selected_index: number[] = [];
    loaded_images: string[] = [];

    //We use an Observable in this spot to use as a constant checker for if the imagej_lock file exists or not
    // This helps make sure the button is always active based on if imageJ is already open or not
    fileExists$: Observable<boolean> = new Observable();
    private _pollingSubscription: Subscription = new Subscription();

    selectedType: string = "";
    fileTypes: Type[] = [];

    constructor(private _macrosService: MacrosService, public _folderServer: FolderService) { }

    ngOnInit(): void {
        this.checkFileExists();
        this.selectedType = ".jpg";
        this.readImages();

    }

    ngOnDestroy() {
        if (this._pollingSubscription) {
          this._pollingSubscription.unsubscribe();
        }
      }

    //Sets the observable for checking if the file exists
    checkFileExists() {
        this.fileExists$ = interval(5000).pipe(
            switchMap(() => this._folderServer.fileExists('/lock/imagej_lock.txt'))
          );
          this._pollingSubscription = this.fileExists$.subscribe();
    }

    //This takes in a bunch of nonesense string data and parses out the image names held in the html 
    readImages(){
        //This is the path of where the results images should be inside of the docker container
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

    //This loads the page just to keep updated the images that are able to be processed
    loadPage(){
        //this.fileExists = this._folderServer.fileExists("/lock/imagej_lock.txt")
        //setTimeout(() => {},5000);
        //console.log(this.fileExists.valueOf());
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

    //This sends a request to the macrosService with the images selected for when imageJ is opened
    loadImagej(images: string[], indexes: number[]){
        var selected_images = [];
        //If no images are selected then a "null" keyword is passed
        if(indexes.length == 0){
            console.log("No images selected");
            selected_images.push("null");
        }else{
            //If images are selected then they get added to an array to be sent to the macrosService
            for(var i = 0; i < indexes.length; ++i){
                selected_images[i] = images[indexes[i]];
            }
        }
        this._macrosService.getImagejOpen(selected_images);
    }
    //This is just a functiont o communicate with macrosService to open up xpra when the button is pressed
    updateToXpra(){
        console.log("Sending to XPRA");
        this._macrosService.getXpraServer();
      }
    
      //This helps keep track of what images are and are not selected
    currentSelectedImage(image_index: number){
        var index = this.selected_index.indexOf(image_index);
        if(index == -1){
            this.selected_index.push(image_index);
        }else{
            this.selected_index.splice(index, 1);
        }
    }

    //This keeps track of the type that is currently selected from the html drop down table
    selectType(event: Event) {
        this.selectedType = (event.target as HTMLSelectElement).value;
      }



}