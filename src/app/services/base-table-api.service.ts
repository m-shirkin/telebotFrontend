import {from, Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {concatAll, last, map} from 'rxjs/operators';

export interface SortDirection {
  [field: string]: 'asc' | 'desc';
}

interface IQuery {
  offset?: number;
  size?: number;
  sort?: SortDirection;
}

export class BaseTableApiService<IEntity> {
  private elementsVisible: Subject<Array<IEntity>>;

  // tslint:disable-next-line:variable-name
  private _totalSize: Subject<number>;

  get totalSize(): Observable<number> {
    return this._totalSize;
  }

  constructor(
    private http: HttpClient,
    private apiUrl: string,
  ) {
    this.elementsVisible = new Subject<Array<IEntity>>();
    this._totalSize = new Subject<number>();
  }

  private updateTotalSize(): Observable<void> {
    return this.http.get(
      this.apiUrl + '/size',
      {
        responseType: 'text',
      }
    ).pipe(
      map(
        (response: string): void => {
          this._totalSize.next(parseInt(response, 10));
        }
      )
    );
  }

  getVisibleElements(): Observable<Array<IEntity>> {
    return this.elementsVisible;
  }

  produceUrl(parameters: IQuery): string {
    let url = this.apiUrl + '?';
    url += `offset=${parameters.offset || 0}&size=${parameters.size || 0}`;
    if (parameters.sort) {
      url += '&sort=' + Object.keys(parameters.sort)
        .map(
          (field: string): string => {
            return field + ':' + parameters.sort[field];
          }
        )
        .join(',');
    }
    return url;
  }

  private updateElements(parameters: IQuery): Observable<void> {
    return this.http.get(
      this.produceUrl(parameters)
    ).pipe(
      map(
        (response: object): void => {
          this.elementsVisible.next(response as Array<IEntity>);
        }
      )
    );
  }

  update(parameters: IQuery): Observable<void> {
    return from([
      this.updateTotalSize(),
      this.updateElements(parameters)
    ]).pipe(
      concatAll(),
      last(),
    );
  }
}
