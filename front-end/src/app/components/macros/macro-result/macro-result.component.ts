import { Component, OnInit } from '@angular/core';
import { MacrosService } from 'src/app/services/flask/macros/macros.service';

declare const $: any;
    declare interface RouteInfo {
        path: string;
        title: string;
        icon: string;
        class: string;
    }
    export const ROUTES: RouteInfo[] = [
        { path: '/dashboard', title: 'Dashboard',  icon: 'home', class: '' },
        { path: '/class', title: 'Class',  icon: 'description', class: '' },
        { path: '/student', title: 'Students',  icon: 'apps', class: '' },
        { path: '/profile', title: 'Profile',  icon: 'person', class: '' },

    ];

@Component({
	selector: 'app-macro-result',
	templateUrl: './macro-result.component.html',
	styleUrls: ['./macro-result.component.css']
})


export class MacroResultComponent implements OnInit {
	serverAddress = "http://bda.as.kent.edu:5000/"
	waitingMacro = true;
	jobIds:any;
	macroFolder = this._macroService.getMacroFolder();	

	
	async loadMacroResult()
  {
		this.waitingMacro = true;
		this.jobIds = this._macroService.getMacroStatus().then(
			(jobIds) => jobIds,
			(jobIds) => jobIds
		);
  }

	constructor(private _macroService:MacrosService) {
		}

	ngOnInit(): void {
		this.loadMacroResult();		
	}

}
