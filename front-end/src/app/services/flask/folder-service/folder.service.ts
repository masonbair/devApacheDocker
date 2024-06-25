import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MacrosService } from '../macros/macros.service';
import { ServerService } from '../../server.service';

@Injectable({
  providedIn: 'root'
})



export class FolderService {

  foldersList:FolderClass[] = [];
  private serverAddress = this._ServerService.getServerAddress();

  getFolder(index:number)
  {
    console.log(this.foldersList);

  }

  
  callFolders()
  {
    this.http.get(`${this.serverAddress}`)
    let promise = new Promise((resolve, reject) => {
      this.http.get(`${this.serverAddress}/directories/`)
        .subscribe( { next: (resp:any) =>{
          let tempDirectories = resp['directories'];
          let index = 0;
          this.foldersList = [];
          for(var item of tempDirectories)
          {
            let newFolder = new FolderClass(item, index);
            index++;
            this.foldersList.push(newFolder);
          }
          resolve(this.foldersList);
      }, error:(err:any) =>{
          reject("Failed");
      }
    })
    });
    return promise;
  }
    
  constructor(private http:HttpClient, private _macrosService:MacrosService, private _ServerService:ServerService) { } //with the http client we can add observables for http requests, they are more powerful than promises
}

export class FolderClass{
  Name: string
  Id: number
  File: string

  constructor(pName: string, pId: number)
  {
    this.Name = pName;
    this.Id = pId;
    this.File = this.extractFolderName(pName);
  }

  private extractFolderName(fullDirect: string): string{
	  const parts = fullDirect.split('/');
	  return parts[parts.length - 2];
  }
}
