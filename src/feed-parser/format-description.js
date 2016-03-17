import cheerio from 'cheerio';

export default function formatDescription(unformattedDescription) {
  const $ = cheerio.load(unformattedDescription);
  let textRepresentation = $.root().text();

  if (textRepresentation.endsWith('[…]')) {
    textRepresentation = textRepresentation.slice(0, textRepresentation.length - 3);
  }

  /* eslint no-control-regex: 0 */ /* We do actually deal with control characters here */
  // Fix for feeds with &nbps; (NO-BREAK SPACE) characters, where we want just normal spaces
  textRepresentation = textRepresentation.replace(new RegExp('\xA0', 'g'), ' ');

  // Some ATOM feeds include a new-line character, which we replace with a space
  textRepresentation = textRepresentation.replace(new RegExp('\n', 'g'), ' ');

  // The previous two replacements can result in double spacs, remove those
  textRepresentation = textRepresentation.replace(new RegExp('  ', 'g'), ' ');
  return textRepresentation.trim();
}
