import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BloggerResponse } from './blogger-response';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

@Injectable({
  providedIn: 'root',
})
export class BloggerService {
  private url =
    'https://www.googleapis.com/blogger/v3/blogs/8000554665921912318/posts';
  private key: string;

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.getApiSecret();
  }

  getRecentPosts(): Observable<any> {
    console.log('service called...');
    return this.httpClient.get<any>(this.url, this.getBloggerOptions());
  }

  async getApiSecret(): Promise<any> {
    let response;

    try {
      const secret_name = 'prod/blogger';

      const client = new SecretsManagerClient({
        region: 'us-west-2',
      });
      response = await client.send(
        new GetSecretValueCommand({
          SecretId: secret_name,
          VersionStage: 'AWSCURRENT',
          // VersionStage defaults to AWSCURRENT if unspecified
        })
      );
    } catch (error) {
      console.log(error);
      // For a list of exceptions thrown, see
      // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
      throw error;
    }

    return response.SecretString;
  }
  getBloggerOptions(): any {
    const rsp = this.getApiSecret();
    rsp.then((data) => {
      console.log('getting promise');
      this.key = JSON.stringify(data);
      console.log(this.key);
    });
    return {
      headers: this.headers,
      params: { ['key']: this.key },
      responseType: 'json',
    };
  }
  headers: HttpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
}
