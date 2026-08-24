const query = `
  query($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      streamingEpisodes {
        title
        thumbnail
        url
        site
      }
    }
  }
`;
fetch('https://graphql.anilist.co', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query, variables: { id: 16498 } }) // Attack on titan
}).then(res => res.json()).then(data => console.log(JSON.stringify(data, null, 2)));
