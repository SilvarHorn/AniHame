const query = `
  query($page: Int = 1, $perPage: Int = 20, $search: String, $genre_in: [String], $status_in: [MediaStatus], $seasonYear: Int, $season: MediaSeason, $format_in: [MediaFormat], $sort: [MediaSort] = [POPULARITY_DESC]) {
    Page(page: $page, perPage: $perPage) {
      media(search: $search, genre_in: $genre_in, status_in: $status_in, seasonYear: $seasonYear, season: $season, format_in: $format_in, type: ANIME, isAdult: false, sort: $sort) {
        id
      }
    }
  }
`;

async function test() {
  const variables = {
    search: undefined,
    genre_in: undefined,
    status_in: undefined,
    seasonYear: undefined,
    season: undefined,
    format_in: undefined,
    sort: ["POPULARITY_DESC"],
    page: 1,
    perPage: 24
  };

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ query, variables })
  });

  const json = await response.json();
  console.log(JSON.stringify(json, null, 2));
}

test();
