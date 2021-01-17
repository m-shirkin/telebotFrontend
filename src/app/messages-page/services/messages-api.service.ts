import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiConfig} from '../../app.config';
import {BaseTableApiService} from '../../services/base-table-api.service';
import {IMessageEntity} from '../message-entity';

@Injectable({
  providedIn: 'root'
})
export class MessagesApiService extends BaseTableApiService<IMessageEntity> {
  constructor(
    http: HttpClient,
    private apiConfig: ApiConfig,
  ) {
    super(
      http,
      apiConfig.apiUrl + 'messages',
    );
  }
}
