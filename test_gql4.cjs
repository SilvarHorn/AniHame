const query = `
  query($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      studios(isMain: true) { edges { isMain node { name } } }
    }
  }
`;

fetch('https://graphql.anilist.co', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  body: JSON.stringify({ query, variables: { id: 1 } })
}).then(res => res.json()).then(d => console.log(JSON.stringify(d, null, 2))).catch(console.error);
