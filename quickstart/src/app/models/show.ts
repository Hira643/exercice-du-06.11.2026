export interface ShowImage {
  medium: string;
  original: string;
}

export interface Show {
  id: number;
  name: string;
  url: string;
  image: ShowImage | null;
  summary: string | null;
  status: string;
  genres: string[];
  language: string | null;
  premiered: string | null;
  rating: { average: number | null };
}

export interface Episode {
  id: number;
  season: number;
  number: number | null;
  name: string;
}

export interface ShowDetail extends Show {
  _embedded: { episodes: Episode[] };
}

export interface SearchResult {
  score: number;
  show: Show;
}

export interface LoadState<T> {
  loading: boolean;
  data: T;
  error: string;
}
