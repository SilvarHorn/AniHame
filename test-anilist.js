const fetch = require('node-fetch'); // node 18+ has global fetch, but we can just run it
const query = `
  query($page: Int = 1, $perPage: Int = 20, $search: String, $genre_in: [String], $status_in: [MediaStatus], $seasonYear_in: [Int], $season_in: [MediaSeason], $format_in: [MediaFormat], $sort: [MediaSort] = [POPULARITY_DESC]) {
    Page(page: $page, perPage: $perPage) {
      media(search: $search, genre_in: $genre_in, status_in: $status_in, seasonYear_in: $seasonYear_in, season_in: $season_in, format_in: $format_in, type: ANIME, isAdult: false, sort: $sort) {
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
    seasonYear_in: undefined,
    season_in: undefined,
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
