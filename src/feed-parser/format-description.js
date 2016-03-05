import cheerio from 'cheerio';

export default function formatDescription(unformattedDescription) {
  const $ = cheerio.load(unformattedDescription);
  let textRepresentation = $.root().text();

  if (textRepresentation.endsWith('[…]')) {
    textRepresentation = textRepresentation.slice(0, textRepresentation.length - 3);
  }

  // Fix for feeds with &nbps; (NO-BREAK SPACE) characters, where we want just normal spaces
  textRepresentation = textRepresentation.replace(new RegExp('\xA0', 'g'), ' ');
  return textRepresentation.trim();
}
