export const ANILIST_API_URL = 'https://graphql.anilist.co';

export async function fetchAnilist<T = any>(query: string, variables: any = {}, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(ANILIST_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query, variables })
      });
      
      const json = await response.json().catch(()=>null);
      if (json && json.errors) {
        throw new Error(json.errors[0].message);
      }
      if (!response.ok) {
        if (response.status === 429) {
          await new Promise(r => setTimeout(r, 1000 * (i + 1)));
          continue;
        }
        throw new Error('HTTP Error ' + response.status);
      }
      return json.data;
    } catch (err: any) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw new Error('Failed to fetch from AniList API');
}

export const TRENDING_ANIME_QUERY = `
  query($page: Int = 1, $perPage: Int = 10, $countryOfOrigin: CountryCode) {
    Page(page: $page, perPage: $perPage) {
      media(sort: TRENDING_DESC, type: ANIME, isAdult: false, countryOfOrigin: $countryOfOrigin) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          extraLarge
          large
        }
        bannerImage
        averageScore
        description(asHtml: false)
        episodes
        status
        genres
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
      }
    }
  }
`;

export const AIRING_SCHEDULE_QUERY = `
  query($page: Int = 1, $perPage: Int = 50, $airingAt_greater: Int, $airingAt_lesser: Int) {
    Page(page: $page, perPage: $perPage) {
      airingSchedules(airingAt_greater: $airingAt_greater, airingAt_lesser: $airingAt_lesser, sort: TIME) {
        id
        airingAt
        episode
        media {
          id
          countryOfOrigin
          title {
            romaji
            english
          }
          coverImage {
            large
            extraLarge
          }
        }
      }
    }
  }
`;

export const ANIME_DETAILS_QUERY = `
  query($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
      }
      coverImage {
        extraLarge
      }
      bannerImage
      averageScore
      description(asHtml: true)
      episodes
      status
      startDate {
        year
        month
        day
      }
      streamingEpisodes {
        title
        thumbnail
        url
        site
      }
      genres
      nextAiringEpisode {
        airingAt
        episode
      }
    }
  }
`;

export const SEARCH_ANIME_QUERY = `
  query($page: Int = 1, $perPage: Int = 20, $search: String, $genre_in: [String], $status_in: [MediaStatus], $seasonYear: Int, $season: MediaSeason, $format_in: [MediaFormat], $sort: [MediaSort] = [POPULARITY_DESC]) {
    Page(page: $page, perPage: $perPage) {
      media(search: $search, genre_in: $genre_in, status_in: $status_in, seasonYear: $seasonYear, season: $season, format_in: $format_in, type: ANIME, isAdult: false, sort: $sort) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
        }
        averageScore
        episodes
        genres
        status
      }
    }
  }
`;

export const LATEST_UPDATED_ANIME_QUERY = `
  query($page: Int = 1, $perPage: Int = 10, $countryOfOrigin: CountryCode) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        hasNextPage
      }
      media(sort: UPDATED_AT_DESC, type: ANIME, isAdult: false, status: RELEASING, countryOfOrigin: $countryOfOrigin) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
          extraLarge
        }
        averageScore
        episodes
        genres
      }
    }
  }
`;
