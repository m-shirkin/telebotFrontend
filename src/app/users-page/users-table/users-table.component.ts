import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {IUserEntity} from '../user-entity';
import {UsersApiService} from '../services/users-api.service';
import {Observable} from 'rxjs';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {SortDirection} from '../../services/base-table-api.service';
import {MatSort, Sort} from '@angular/material/sort';

/**
 * Table with users
 */
@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css']
})
export class UsersTableComponent implements AfterViewInit {
  displayedColumns: Array<string> = [
    'user_id',
    'first_name',
    'last_name',
    'username',
    'language_code',
  ];

  dataSource: Observable<Array<IUserEntity>>;

  /**
   * Current sort direction
   */
  sortDirection: SortDirection;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public usersApi: UsersApiService,
  ) {
    this.dataSource = this.usersApi.elementsVisible;
  }

  ngAfterViewInit(): void {
    this.updateApi().subscribe();
  }

  /**
   * Reload current page contents from server
   */
  updateApi(
    pageIndex: number = this.paginator.pageIndex,
    pageSize: number = this.paginator.pageSize
  ): Observable<void> {
    return this.usersApi.update({
      offset: pageIndex * pageSize,
      size: pageSize,
      sort: this.sortDirection,
    });
  }

  onPageChange(event: PageEvent): void {
    this.updateApi(event.pageIndex, event.pageSize).subscribe();
  }

  onSortChange(event: Sort): void {
    this.sortDirection = {};
    this.sortDirection[event.active] = event.direction || 'asc';
    this.updateApi().subscribe();
  }
}
