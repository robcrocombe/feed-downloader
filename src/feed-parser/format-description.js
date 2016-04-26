import cheerio from 'cheerio';

export default function formatDescription(unformattedDescription) {
  const $ = cheerio.load(unformattedDescription);
  let textRepresentation = $.root().text();

  // Remove "continue reading" etc from end of descriptions
  if (textRepresentation.endsWith('[…]')) {
    textRepresentation = textRepresentation.slice(0, textRepresentation.length - 3);
  }

  const continueReadingLocation = textRepresentation.indexOf('… Continue reading →');
  if (continueReadingLocation !== -1) {
    textRepresentation = textRepresentation.slice(0, continueReadingLocation);
  }

  /* eslint no-control-regex: 0 */ /* We do actually deal with control characters here */
  // Fix for feeds with &nbps; (NO-BREAK SPACE) characters, where we want just normal spaces
  textRepresentation = textRepresentation.replace(new RegExp('\xA0', 'g'), ' ');

  // Some feeds include a new-line character or tab character, which we replace with a space
  textRepresentation = textRepresentation.replace(new RegExp('\n', 'g'), ' ');
  textRepresentation = textRepresentation.replace(new RegExp('\t', 'g'), ' ');

  // The previous two replacements can result in double spacs, remove those
  textRepresentation = textRepresentation.replace(new RegExp('\\s\\s+', 'g'), ' ');
  return textRepresentation.trim();
}
