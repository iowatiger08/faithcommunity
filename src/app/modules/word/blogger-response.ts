
import { BloggerItem } from './blogger-item';
export interface BloggerResponse {
    kind: string;
    nextPageToken:string;
    items: BloggerItem[];
    etag: string;
}
