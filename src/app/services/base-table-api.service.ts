import {from, Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {concatAll, last, map} from 'rxjs/operators';

/**
 * Interface which maps fields to sort directions
 */
export interface SortDirection {
  [field: string]: 'asc' | 'desc';
}

/**
 * Interface with parameters, that form an HTTP query string
 */
interface IQuery {
  offset?: number;
  size?: number;
  sort?: SortDirection;
}

/**
 * Base class for API services that retrieve data for tables
 */
export class BaseTableApiService<IEntity> {
  /**
   * Current rows, visible in the table
   * @private
   */
    // tslint:disable-next-line:variable-name
  private _elementsVisible: Subject<Array<IEntity>>;

  get elementsVisible(): Observable<Array<IEntity>> {
    return this._elementsVisible;
  }

  /**
   * Total number of entries in the table.
   * @private
   */
    // tslint:disable-next-line:variable-name
  private _totalSize: Subject<number>;

  get totalSize(): Observable<number> {
    return this._totalSize;
  }

  constructor(
    private http: HttpClient,
    private apiUrl: string,
  ) {
    this._elementsVisible = new Subject<Array<IEntity>>();
    this._totalSize = new Subject<number>();
  }

  /**
   * Request total number of entries from the server.
   * @private
   */
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

  /**
   * Produce URL with query string from query parameters.
   * @param parameters
   */
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

  /**
   * Update visible elements.
   * @param parameters: query parameters.
   * @private
   */
  private updateElements(parameters: IQuery): Observable<void> {
    return this.http.get(
      this.produceUrl(parameters)
    ).pipe(
      map(
        (response: object): void => {
          this._elementsVisible.next(response as Array<IEntity>);
        }
      )
    );
  }

  /**
   * Update visible elements and total size.
   * @param parameters: query parameters.
   */
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
