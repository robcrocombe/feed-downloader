import cheerio from 'cheerio';

export default function formatDescription(unformattedDescription) {
  const $ = cheerio.load(unformattedDescription);
  const textRepresentation = $.root().text();
  return textRepresentation.trim();
}
