import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedMacroService {

  private subject = new Subject<any>();
  private currentMacro:string = "3D";

  sendMacroNameUpdate(Macro:string) {
    this.currentMacro =  Macro;
    this.subject.next({ text: Macro });
  }

  getMacroNameUpdate(): Observable<any>{ 
    return this.subject.asObservable();
  }

  getMacroName():string
  {
    return this.currentMacro;
  }

  constructor() { }
}
