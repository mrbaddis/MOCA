import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService<T> {

  private endpoint;

  constructor(
    @Inject('resource') private resource: string,
    private http: HttpClient
  ) {
      this.endpoint = `${environment.baseUrl}/${this.resource}`
   }

  findAll(): Observable<T[]> {
    return this.http.get(this.endpoint) as Observable<T[]>
  }

  create(data: T) {
    return this.http.post(this.endpoint, (data));
  }

  delete(id: number) {
    return this.http.delete(`${this.endpoint}/${id}`)
  }

  update(id: number, data: Partial<T>) {
    return this,this.http.patch(`${this.endpoint}/${id}`, (data))
  }
}
