import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CrawlerService {
  private readonly apiUrl = '/api'; // Proxy endpoint

  constructor(private http: HttpClient) {}

  fetchContentByTags(tags: string[]): Observable<{ titles: string[]; paragraphs: string[] }> {
    return this.http.get(this.apiUrl, { responseType: 'text' }).pipe(
      map((html: string) => this.sanitizeAndParseHTML(html, tags)),
      catchError((error) => {
        console.error('Error fetching content:', error); // Logging error for debugging
        return throwError(() => new Error('Failed to fetch content'));
      })
    );
  }

  private sanitizeAndParseHTML(html: string, tags: string[]): { titles: string[]; paragraphs: string[] } {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const sanitize = (input: string | null): string =>
      input ? input.replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';

    const titles = tags.flatMap((tag) =>
      Array.from(doc.querySelectorAll(tag)).map((el) => sanitize(el.textContent))
    );

    const paragraphs = Array.from(doc.querySelectorAll('p'))
      .map((el) => sanitize(el.textContent))
      .filter((text) => text);

    return { titles, paragraphs };
  }
}
