export default function getLastModifiedDate(httpHeaders) {
  const lastModifiedHeader = httpHeaders['last-modified'];
  const dateHeader = httpHeaders.date;

  let lastModifiedDate = null;

  if (lastModifiedHeader) {
    lastModifiedDate = new Date(lastModifiedHeader);
  } else if (dateHeader) {
    lastModifiedDate = new Date(dateHeader);
  }

  return lastModifiedDate;
}
