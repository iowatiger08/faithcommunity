import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BloggerService } from '../word/blogger.service';
import { BloggerItem } from '../word/blogger-item';

@Component({
  selector: 'app-outreach',
  templateUrl: './outreach.component.html',
  styleUrls: ['./outreach.component.scss']
})
export class OutreachComponent implements OnInit, OnDestroy {
  posts: BloggerItem[] = [];
  errorMessage: string = '';
  loading: boolean = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private bloggerService: BloggerService) { }

  ngOnInit(): void {
    this.getRecentPosts();
  }

  getRecentPosts(): void {
    console.log('Getting recent posts...');
    this.loading = true;
    this.bloggerService
      .getRecentPosts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          console.log('Received response:', response);
          this.extractPosts(response);
          this.loading = false;
        },
        (error) => {
          console.error('Request failed with error:', error);
          this.errorMessage = 'Failed to load recent posts';
          this.loading = false;
        }
      );
  }

  extractPosts(response: any): void {
    console.log('Extracting posts...');
    if (response && response.items) {
      this.posts = response.items.map((item: any) => ({
        kind: item.kind,
        url: item.url,
        published: item.published,
        title: item.title,
        id: item.id,
      }));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
