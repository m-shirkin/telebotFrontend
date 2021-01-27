import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MessagesApiService} from '../services/messages-api.service';
import {IMessageEntity} from '../message-entity';
import {MatSort, Sort} from '@angular/material/sort';
import {SortDirection} from '../../services/base-table-api.service';

/**
 * Table with messages
 */
@Component({
  selector: 'app-messages-table',
  templateUrl: './messages-table.component.html',
  styleUrls: ['./messages-table.component.css']
})
export class MessagesTableComponent implements AfterViewInit {
  displayedColumns: Array<string> = [
    'message_id',
    'from_user_id',
    'date',
    'text',
  ];

  dataSource: Observable<Array<IMessageEntity>>;

  /**
   * Current sort direction
   */
  sortDirection: SortDirection;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

  constructor(
    public messagesApi: MessagesApiService,
  ) {
    this.dataSource = this.messagesApi.elementsVisible;
  }

  ngAfterViewInit(): void {
    // this.sort.sort(this.sort.sortables.get('date'));
    // this.sort.direction = 'desc';
    this.updateApi().subscribe();
  }

  /**
   * Reload current page contents from server
   */
  updateApi(
    pageIndex: number = this.paginator.pageIndex,
    pageSize: number = this.paginator.pageSize
  ): Observable<void> {
    return this.messagesApi.update({
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
