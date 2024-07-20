import { Component, OnInit } from '@angular/core';
import {SharedMacroService} from '../../services/macros/shared-macro.service';
import { Router } from '@angular/router';
import { MacrosService } from 'src/app/services/flask/macros/macros.service';
import { MacroListComponent } from '../macro-list/macro-list.component';

@Component({
  selector: 'app-misc-buttons',
  templateUrl: './misc-buttons.component.html',
  styleUrls: ['./misc-buttons.component.css']
})
export class MiscButtonsComponent implements OnInit {


  constructor(private _SharedMacroService:SharedMacroService, private _macrosService: MacrosService) {  }
  macro = this._SharedMacroService.getMacroName();
  
  isActive: number = 1;
  MacroType: string = "";

  updateImagej()
  {
    var temp = ["null"];
    this._macrosService.getImagejOpen(temp);
  }

  updateToXpra(){
    console.log("Sending to XPRA");
    this._macrosService.getXpraServer();
  }

  ngOnInit(): void {

  }

}