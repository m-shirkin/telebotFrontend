import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ApiConfig} from '../../app.config';
import {map} from 'rxjs/operators';

/**
 * API for managing files on the server
 */
@Injectable({
  providedIn: 'root'
})
export class FileApiService {
  constructor(
    private apiConfig: ApiConfig,
    private http: HttpClient,
  ) {
  }

  /**
   * Get list with all files on the server
   */
  getFileList(): Observable<Array<string>> {
    return this.http.get(this.apiConfig.apiUrl + 'telebot/files')
      .pipe(map((value: object): Array<string> => {
        return value as Array<string>;
      }));
  }

  /**
   * Load contents of a specific file
   * @param filename: name of the file
   */
  loadFile(filename: string): Observable<string> {
    return this.http.get(
      this.apiConfig.apiUrl + 'telebot/files/' + filename,
      {
        responseType: 'text'
      });
  }

  /**
   * Rewrite contents of a specific file, or create new file
   * @param filename: name of the file
   * @param contents: new contents
   */
  pushFile(filename: string, contents: string): Observable<void> {
    return this.http.post(
      this.apiConfig.apiUrl + 'telebot/files/' + filename,
      contents,
    ).pipe(map(
      (response): void => {
      }
    ));
  }

  /**
   * Delete specific file
   * @param filename: name of the file
   */
  deleteFile(filename: string): Observable<void> {
    return this.http.delete(
      this.apiConfig.apiUrl + 'telebot/files/' + filename,
    ).pipe(map(
      (response): void => {
      }
    ));
  }

  /**
   * Get a name of the running file
   */
  getRunningFile(): Observable<string> {
    return this.http.get(
      this.apiConfig.apiUrl + 'telebot/run',
    {
      responseType: 'text'
    });
  }

  /**
   * Send a specific file for an execution
   * @param filename: name of the file
   */
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
