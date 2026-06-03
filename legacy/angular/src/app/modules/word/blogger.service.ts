import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BloggerService {
  constructor(private httpClient: HttpClient) {}

  getRecentPosts(): Observable<any> {
    console.log('Calling Blogger API via Lambda proxy...');
    return this.httpClient.get<any>(environment.bloggerApiUrl, {
      headers: this.headers,
      responseType: 'json' as const,
    });
  }

  private headers: HttpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
}
