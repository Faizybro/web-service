import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrawlerService } from './service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Web Crawler</h1>
      <button (click)="fetchContent()">Fetch Content</button>
      <div *ngIf="loading">Loading...</div>
      <div *ngIf="headers.length > 0 || descriptions.length > 0">
        <h2>Headers</h2>
        <ul>
          <li *ngFor="let header of headers">{{ header }}</li>
        </ul>
        <h2>Descriptions</h2>
        <ul>
          <li *ngFor="let description of descriptions">{{ description }}</li>
        </ul>
      </div>
      <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
    </div>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  headers: string[] = [];
  descriptions: string[] = [];
  loading = false;
  errorMessage: string | null = null;

  private crawlerService = inject(CrawlerService);

  fetchContent(): void {
    this.loading = true;
    this.errorMessage = null;

    this.crawlerService.fetchContentByTags(['h1', 'h2', 'h3']).subscribe({
      next: ({ headers, descriptions }: { headers: string[]; descriptions: string[] }) => {
        this.headers = headers;
        this.descriptions = descriptions;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.message || 'An unknown error occurred';
      },
      complete: () => (this.loading = false),
    });
  }
}
