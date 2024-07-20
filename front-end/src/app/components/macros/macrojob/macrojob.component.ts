import { Component, OnInit, Input,Directive, HostBinding } from '@angular/core';
import { MacrosService, MacroClass } from 'src/app/services/flask/macros/macros.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
  selector: 'app-macrojob',
  templateUrl: './macrojob.component.html',
  styleUrls: ['./macrojob.component.css'],
  template: "<p>Hello, {{name}}!</p>"
})
export class MacrojobComponent implements OnInit {

  @Input() waitingMacroId: any;
  @Input() macroFolder:any;
  jobData:MacroClass = new MacroClass('','','',false);
  macroReady = false;  
  queuePos:any;
  serverAddress = this._macroService.getServerAdress();

  async loadMacroStatus()
  {
    while(!this.macroReady){
      this.jobData = await this._macroService.getJobStatus(this.waitingMacroId[0]) as MacroClass;
      this.macroReady = this.jobData.Status;
      if(!this.macroReady){
        this.queuePos = this._macroService.getJobQueuePos(this.waitingMacroId[0]).then(
          (queuePos) => queuePos,
          (error) => error,          
        );
      }      
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec wait for every try
      console.log(this.jobData);
    }
  }

  updateToXpra(){
    console.log("Sending to XPRA");
    this._macroService.getXpraServer();
  }
  
  constructor(private _macroService:MacrosService,
    private dom: DomSanitizer) {}
    photoURL(imageUrl:any) {
      return this.dom.bypassSecurityTrustUrl(imageUrl);
  }

  ngOnInit(): void {
    this.loadMacroStatus();
  }

}
