import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrawlerService } from './service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Web Crawler</h1>
      <button (click)="fetchContent()">Fetch Content</button>
      <div *ngIf="loading">Loading...</div>
      <div *ngIf="titles.length > 0 || paragraphs.length > 0">
        <h2>Titles</h2>
        <ul>
          <li *ngFor="let title of titles">{{ title }}</li>
        </ul>
        <h2>Paragraphs</h2>
        <ul>
          <li *ngFor="let paragraph of paragraphs">{{ paragraph }}</li>
        </ul>
      </div>
      <div *ngIf="error" class="error">{{ error }}</div>
    </div>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  titles: string[] = [];
  paragraphs: string[] = [];
  loading = false;
  error: string | null = null;

  private crawlerService = inject(CrawlerService);

  fetchContent(): void {
    this.loading = true;
    this.error = null;

    this.crawlerService.fetchContentByTags(['h1', 'h2', 'h3']).subscribe({
      next: (data: { titles: string[]; paragraphs: string[] }) => {
        this.titles = data.titles;
        this.paragraphs = data.paragraphs;
      },
      error: (err) => {
        this.error = (err as Error).message || 'Unexpected error occurred.';
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
