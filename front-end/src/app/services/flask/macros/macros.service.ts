import { Injectable } from '@angular/core';
import { HttpParams } from "@angular/common/http";
import { HttpClient } from '@angular/common/http';
import { FolderClass } from '../folder-service/folder.service';
import { SharedMacroService } from '../../macros/shared-macro.service';
import { ServerService } from '../../server.service';

@Injectable({
  providedIn: 'root'
})
export class MacrosService {

  private serverAddress = this._ServerService.getServerAddress()
  private macroFolders:FolderClass[] = [];

  offsetX = 0;
  offsetY = 0;
  
  foldersList:FolderClass[] = [];
  macroName = "3D"; //for now

  jobsIdsSent:any[] = [];
  
  changeMacroFolders(folders:FolderClass[])
  {    
    this.macroFolders = folders;
  }

  getMacroFolder()
  {
    return this.macroFolders;
  }

  async sendMacroToQueue()
  {
    let macroName = this._SharedMacroService.getMacroName();
    let ids:any[] = [];
    let promise = new Promise((resolve, reject) => {
      this.http.post(`${this.serverAddress}/addMacroToQueue/`, {"folders":this.macroFolders, "offsetX": this.offsetX, "offsetY":this.offsetY, "name":macroName})
        .subscribe( { next: (resp:any) =>{
          let response = resp['message'];    
          for(let item in response)
          {
            ids.push(response[item]);
          }
          this.jobsIdsSent = ids;
          resolve(this.jobsIdsSent);
      }, error:(err:any) =>{
          reject("Failed");
      }
    })
    });
    return promise;
  }

  async getMacroStatus()
  {
    let promise = new Promise((resolve, reject) => {
      this.http.post(`${this.serverAddress}/macroStatus/`, {'jobs':this.jobsIdsSent})
        .subscribe( { next: (resp:any) =>{
          let jobs = resp['message'];
          let jobsStatus = [];
          for(var item of jobs)
          {
            jobsStatus.push(item);
          }
          resolve(jobsStatus);
      }, error:(err:any) =>{
          reject("Failed");
      }
    })
    });
    return promise;
  }

  async getJobStatus(jobId:any)
  {
    let promise = new Promise((resolve, reject) => {
      this.http.post(`${this.serverAddress}/jobIdStatus/`, {'job':jobId})
        .subscribe( { next: (resp:any) =>{
          let job = resp['message'];
          console.log(job);
          let jobResult:MacroClass = new MacroClass('',`${this.serverAddress}${job[2]}`,job[0],job[1]);
          console.log(`resulting data ${jobResult}`);
          resolve(jobResult);
      }, error:(err:any) =>{
          reject("Failed");
      }
    })
    });
    return promise;
  }

  async callFolders()
  {
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

  async getJobQueuePos(jobId:string){
    let params = new HttpParams();
    params = params.append('jobid', jobId);
    let promise = new Promise((resolve, reject) => {
      this.http.get(`${this.serverAddress}/jobqueuepos/`,  {params: params})
        .subscribe( { next: (resp:any) =>{
          let jobPosition = resp['position'];        
          jobPosition = Number(jobPosition);
          console.log(`Got position = ${jobPosition}`);
          resolve(jobPosition);
      }, error:(err:any) =>{
          reject("Failed");
      }
    })
    });
    return promise;
  }

  //This works with XPRA to send the user to the xpra main page
  async getXpraServer(){
    window.open(`${this.serverAddress}/xpra/`, '_blank');
  }

  async getImagejOpen(image:string){
    const upload$ = this.http.post(`${this.serverAddress}/startImagej/`, {"image":image});
    upload$.subscribe(
      response => {
        console.log('Imagej opened successful:', response);
      },
      error => {
        console.error('Imagej not opened: error:', error);
      }
    );
  }

  getServerAdress(){
    return this.serverAddress;
  }

  constructor(private http:HttpClient, private _SharedMacroService:SharedMacroService, private _ServerService:ServerService) { }
}

export class MacroClass{
  Name: string
  Image: string
  Id: string
  Status: boolean

  constructor(pName: string, pImage: string, pId:string, pStatus:boolean )
  {
    this.Name = pName;
    this.Image = pImage;
    this.Id = pId;
    this.Status = pStatus;
  }
  
}