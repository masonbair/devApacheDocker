import { Component, OnInit } from '@angular/core';
import { FolderService, FolderClass } from 'src/app/services/flask/folder-service/folder.service';
import { Router } from '@angular/router';
import { MacrosService } from 'src/app/services/flask/macros/macros.service';
import { SharedMacroService } from 'src/app/services/macros/shared-macro.service';

@Component({
  selector: 'app-file-picker',
  templateUrl: './file-picker.component.html',
  styleUrls: ['./file-picker.component.css']
})

export class FilePickerComponent implements OnInit {
  
  offSetX = 0;
  offSetY = 0;
  macro = this._SharedMacroService.getMacroName();
  
  folders = this._folderService.callFolders().then(
      (folders) => folders,
      (nofolders) => nofolders
  );

  checkedFolders:number[] = [];     //list for storing the checked items by index

  ngOnInit(): void {    
        
  }

  async callMacro()
  {
    this.macro = this._SharedMacroService.getMacroName();
    
    let macroCallFolders:FolderClass[] = [];
    for(let id = 0; id < this.checkedFolders.length; id ++)
    {      
      for(let folder of this._folderService.foldersList)
      {
        if(folder.Id == Number(this.checkedFolders[id]))
        {
          macroCallFolders.push(folder);
        }
      }
    }
    this._macroService.offsetX = this.offSetX;
    this._macroService.offsetY = this.offSetY;
    this._macroService.changeMacroFolders(macroCallFolders);
    const t = await this._macroService.sendMacroToQueue();
    this.router.navigate(['/macroResult'])
  }

  onCheckboxChange(e:number) {
   let index = this.checkedFolders.indexOf(e);
   if(index == -1)
   {
      this.checkedFolders.push(e);
   }
   else{
      this.checkedFolders.splice(index, 1);
   }
  }

  constructor(
    private _folderService:FolderService,
    private _macroService:MacrosService,
    private _SharedMacroService:SharedMacroService,
    private router:Router,
    ){ }
}
