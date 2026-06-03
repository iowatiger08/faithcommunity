import { TestBed } from '@angular/core/testing';

import { BloggerService } from './blogger.service';

describe('BloggerService', () => {
  let service: BloggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BloggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
