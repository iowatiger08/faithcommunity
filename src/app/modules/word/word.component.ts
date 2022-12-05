import { Component, OnDestroy, OnInit } from '@angular/core';
import { BloggerItem } from './blogger-item';
import { BloggerService } from './blogger.service';
import { BloggerResponse } from './blogger-response';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss'],
})
export class WordComponent implements OnInit, OnDestroy {
  bloggerResponse: BloggerResponse;
  posts: BloggerItem[] = [];

  destroy$: Subject<boolean> = new Subject<boolean>();
  errorMessage: any;
  loading: boolean;
  constructor(private bloggerService: BloggerService) {}

  ngOnInit(): void {
    this.getRecent();
  }
  getRecent() {
    console.log('getting recent...');
    this.bloggerService
      .getRecentPosts()
      //.pipe(take())
      .subscribe(
        (response) => {
          () => (this.bloggerResponse = response);
          console.log('subscribed to resp...');
          this.extractPosts(response);
        },
        (error) => {
          console.error('Request failed with error' );
          console.log(error);
          this.errorMessage = error;
          this.loading = false;
        }
      );
  }
  extractPosts(response) {
    console.log('extract posts...');
    if (response && response.items) {
      response.items.forEach(
        (item: {
          published: string;
          kind: any;
          url: any;
          title: any;
          id: any;
        }) => {
          var aPost: BloggerItem = {
            kind: item.kind,
            url: item.url,
            published: item.published,
            title: item.title,
            id: item.id,
          };
          this.posts.push(aPost);
        }
      );
    }
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
