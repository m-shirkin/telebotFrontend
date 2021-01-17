import {Injectable} from '@angular/core';
import {IUserEntity} from '../user-entity';
import {BaseTableApiService} from '../../services/base-table-api.service';
import {HttpClient} from '@angular/common/http';
import {ApiConfig} from '../../app.config';

@Injectable({
  providedIn: 'root'
})
export class UsersApiService extends BaseTableApiService<IUserEntity>{
  constructor(
    http: HttpClient,
    private apiConfig: ApiConfig,
  ) {
    super(
      http,
      apiConfig.apiUrl + 'users',
    );
  }
}
