import { Component, OnInit } from '@angular/core';
import { HttpClient } from  '@angular/common/http';
import { ServerService } from '../../services/server.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  fileName = '';
  private serverAddress = this._ServerService.getServerAddress();


  constructor(private http: HttpClient, private _ServerService:ServerService) {}

  //The basics of this function are to take a users file and add it to the plugins folder of Fiji-app
  // The file must be of type jar in order for the plugin to work
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file: File = input.files[0];
      if (file) {
        this.fileName = file.name;
        const formData = new FormData();
        formData.append("file", file);
        const upload$ = this.http.post(`${this.serverAddress}/upload/`, formData, { responseType: 'json' });
        upload$.subscribe(
          response => {
            console.log('Upload successful:', response);
          },
          error => {
            console.error('Upload error:', error);
          }
        );
      }
    }
  }

  ngOnInit(): void {
  }

}
