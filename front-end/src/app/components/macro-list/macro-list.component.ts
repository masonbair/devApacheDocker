import { Component, OnInit } from '@angular/core';
import {SharedMacroService} from '../../services/macros/shared-macro.service';
import { Router } from '@angular/router';
import { MacrosService } from 'src/app/services/flask/macros/macros.service';


@Component({
  selector: 'app-macro-list',
  templateUrl: './macro-list.component.html',
  styleUrls: ['./macro-list.component.css']
})
export class MacroListComponent implements OnInit {


  constructor(private _SharedMacroService:SharedMacroService, private _macrosService: MacrosService) {  }

  isActive: number = 1;
  MacroType: string= "3D";

  public updateMacro(data:string)
  {
    //This sends the name of the selected element to a new class to display it on the screem
    this._SharedMacroService.sendMacroNameUpdate(data);
    this.MacroType = this._SharedMacroService.getMacroName();
  }

  updateToXpra(){
    console.log("Sending to XPRA");
    this._macrosService.getXpraServer();
  }

  setActive(buttonNumber: number) {
    this.isActive = buttonNumber === this.isActive ? 0 : buttonNumber;
  }

  ngOnInit(): void {

  }

}