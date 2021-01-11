import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ApiConfig} from '../../app.config';
import {map} from 'rxjs/operators';

@Injectable()
export class FileApiService {
  constructor(
    private apiConfig: ApiConfig,
    private http: HttpClient,
  ) {
  }


  getFileList(): Observable<Array<string>> {
    return this.http.get(this.apiConfig.apiUrl + 'telebot/files')
      .pipe(map((value: object): Array<string> => {
        return value as Array<string>;
      }));
  }

  loadFile(filename: string): Observable<string> {
    return this.http.get(
      this.apiConfig.apiUrl + 'telebot/files/' + filename,
      {
        responseType: 'text'
      });
  }
}
