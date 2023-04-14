import slugify from "slugify";
import jsonld from "jsonld";

export const rawDataToRDF = (rawData: any) => {
  const context = {
    '@vocab': 'http://schema.org/',
    status: {'@reverse': 'object'}
  };
  let graph: object[] = [];

  graph = graph.concat(getJSONLDObjects(rawData.movies, 'Movie'));
  graph = graph.concat(getJSONLDObjects(rawData.books, 'Book'));
  graph = graph.concat(getJSONLDObjects(rawData.games, 'VideoGame'));
  graph = graph.concat(getJSONLDObjects(rawData.comics, 'ComicStory'));
  graph = graph.concat(getJSONLDObjects(rawData.series, 'TVSeries'));

  return {'@context': context, '@graph': graph};
}

export const RDFtoRawData = async (doc: object) => {
  return {
    movies: await getDataFromJSONLD(doc, 'Movie'),
    books: await getDataFromJSONLD(doc, 'Book'),
    comics: await getDataFromJSONLD(doc, 'ComicStory'),
    series: await getDataFromJSONLD(doc, 'TVSeries'),
    games: await getDataFromJSONLD(doc, 'VideoGame'),
    excluded: {
      "movies": [],
      "games": [],
      "books": [],
      "comics": [],
      "series": []
    }
  }
}

async function getDataFromJSONLD(doc: object, type: string) {
  const framed = await jsonld.frame(doc, {"@context": {
      "@vocab": "http://schema.org/",
      "status": {
        "@reverse": "object"
      }
    },"@type": type}
  );

  let data = framed['@graph'];

  if (!data) {
    data = [];

    if (framed['@id']) {
      data = [framed]
    }
  }

  // @ts-ignore
  return data.map(a => a.identifier);
}

function getJSONLDObjects(arr: [], type: string) {
  const graph: object[] = [];
  arr.forEach((item: string) => {
    graph.push({
      '@id': '#' + slugify(item, {lower: true, strict: true}),
      '@type': type,
      identifier: item,
      status: {
        '@id': '#' + slugify(item, {lower: true}) + '-status',
        '@type': 'ConsumeAction'
      }
    });
  });

  return graph;
}
