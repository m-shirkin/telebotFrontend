import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ApiConfig} from '../../app.config';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
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

  pushFile(filename: string, contents: string): Observable<void> {
    return this.http.post(
      this.apiConfig.apiUrl + 'telebot/files/' + filename,
      contents,
    ).pipe(map(
      (response): void => {
      }
    ));
  }

  deleteFile(filename: string): Observable<void> {
    return this.http.delete(
      this.apiConfig.apiUrl + 'telebot/files/' + filename,
    ).pipe(map(
      (response): void => {
      }
    ));
  }

  getRunningFile(): Observable<string> {
    return this.http.get(
      this.apiConfig.apiUrl + 'telebot/run',
    {
      responseType: 'text'
    });
  }

  runFile(filename: string): Observable<void> {
    return this.http.post(
      this.apiConfig.apiUrl + 'telebot/run',
      filename,
    ).pipe(
      map(
        (response: object): void => {
        }
      )
    );
  }
}
