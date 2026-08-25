export interface AnimeTitle {
  romaji: string;
  english: string | null;
  native?: string;
}

export interface AnimeCoverImage {
  extraLarge: string;
  large: string;
}

export interface NextAiringEpisode {
  airingAt: number;
  timeUntilAiring: number;
  episode: number;
}

export interface AnimeMedia {
  id: number;
  idMal?: number;
  type?: string;
  format?: string;
  title: AnimeTitle;
  coverImage: AnimeCoverImage;
  bannerImage: string | null;
  averageScore: number;
  description: string;
  episodes: number | null;
  status: string;
  genres: string[];
  countryOfOrigin?: string;
  nextAiringEpisode: NextAiringEpisode | null;
  streamingEpisodes?: { title: string; url: string; thumbnail: string; site: string }[];
  relations?: {
    edges: {
      relationType: string;
      node: AnimeMedia;
    }[];
  };
}

export interface AiringSchedule {
  id: number;
  
  airingAt: number;
  episode: number;
  media: AnimeMedia;
}

export interface WatchProgress {
  animeId: number;
  animeTitle: string;
  coverImage: string;
  lastEpisodeWatched: number;
  timestamp: number;
}
