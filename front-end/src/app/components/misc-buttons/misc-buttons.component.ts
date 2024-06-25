import { Component, OnInit } from '@angular/core';
import {SharedMacroService} from '../../services/macros/shared-macro.service';
import { Router } from '@angular/router';
import { MacrosService } from 'src/app/services/flask/macros/macros.service';

@Component({
  selector: 'app-misc-buttons',
  templateUrl: './misc-buttons.component.html',
  styleUrls: ['./misc-buttons.component.css']
})
export class MiscButtonsComponent implements OnInit {


  constructor(private _SharedMacroService:SharedMacroService, private _macrosService: MacrosService) {  }
  offSetX = 0;
  offSetY = 0;
  macro = this._SharedMacroService.getMacroName();
  
  isActive: number = 1;

  updateMacro(data:string)
  {
    //This sends the name of the selected element to a new class to display it on the screem
    this._SharedMacroService.sendMacroNameUpdate(data);
  }

  updateToXpra(){
    console.log("Sending to XPRA");
    this._macrosService.getXpraServer();
  }

  async callMacro()
  {
    this.macro = this._SharedMacroService.getMacroName();

    const t = await this._macrosService.sendMacroToQueue();
  }

  ngOnInit(): void {

  }

}