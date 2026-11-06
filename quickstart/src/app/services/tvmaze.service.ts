import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { SearchResult, Show, ShowDetail } from '../models/show';

@Injectable({ providedIn: 'root' })
export class TvmazeService {
  private readonly http = inject(HttpClient);
  private readonly api = 'https://api.tvmaze.com';

  search(query: string) {
    return this.http
      .get<SearchResult[]>(`${this.api}/search/shows`, {
        params: { q: query },
      })
      .pipe(map((results) => results.map((result) => result.show)));
  }

  getShow(id: number) {
    return this.http.get<Show>(`${this.api}/shows/${id}`);
  }

  getShowDetail(id: number) {
    return this.http.get<ShowDetail>(`${this.api}/shows/${id}`, {
      params: { embed: 'episodes' },
    });
  }
}
