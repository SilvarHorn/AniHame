const titles = [
  "Episode 12 - Wound - The Battle for Trost (8)",
  "Episode 1 - To You, in 2000 Years: The Fall of Shiganshina, Part 1",
  "Episode 4 - Night of the Graduation Ceremony - Humanity Rises Again (2)",
  "Episode 100",
  "Episode 5: The Test",
  "ep 2 title something"
];

titles.forEach(t => {
  const m = t.match(/Episode\s+(\d+)\s*[-:]\s*(.*)/i) || t.match(/Ep\s+(\d+)\s*[-:]\s*(.*)/i);
  if (m) {
    console.log(`Num: ${m[1]}, Title: ${m[2]}`);
  } else {
    console.log("No match: " + t);
  }
});
