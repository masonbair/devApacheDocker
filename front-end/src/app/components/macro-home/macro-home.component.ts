import { AfterViewInit,Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedMacroService } from 'src/app/services/macros/shared-macro.service';

@Component({
  selector: 'app-macro-home',
  templateUrl: './macro-home.component.html',
  styleUrls: ['./macro-home.component.css']
})
export class MacroHomeComponent implements AfterViewInit {
  clickEventsubscription:Subscription;
  MacroType = this._macroService.getMacroName();

  updateMacro(){
    this.MacroType = this._macroService.getMacroName();

  }

  constructor( private _macroService: SharedMacroService) {
    this.clickEventsubscription =  this._macroService.getMacroNameUpdate().subscribe(()=>{
      this.updateMacro();
    })
   }

   ngAfterViewInit(): void {
  }

}
