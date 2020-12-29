import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ApiConfig} from '../../app.config';
import {map} from 'rxjs/operators';

@Injectable()
export class FileApiService {
  private currentContents: Subject<string>;

  constructor(
    private apiConfig: ApiConfig,
    private http: HttpClient,
  ) {
    this.currentContents = new Subject<string>();
  }


  getFileList(): Observable<Array<string>> {
    return this.http.get(this.apiConfig.apiUrl + 'telebot/files')
      .pipe(map((value: object): Array<string> => {
        return value as Array<string>;
      }));
  }

  GetCurrentContentsObservable(): Observable<string> {
    return this.currentContents;
  }

  loadFile(filename: string): Observable<void> {
    return this.http.get(
      this.apiConfig.apiUrl + 'telebot/files/' + filename,
      {
        responseType: 'text'
      })
      .pipe(map((contents: string): void => {
        this.currentContents.next(contents);
      }));
  }
}
