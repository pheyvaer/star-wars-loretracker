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
  const framed = await jsonld.frame(doc, {"@context": {
      "@vocab": "http://schema.org/",
      "status": {
        "@reverse": "object"
      }
    },"@type": "Movie"}
  );

  let data = framed['@graph'];

  if (!data) {
    data = [];

    if (framed['@id']) {
      data = [framed]
    }
  }


  return {
    // @ts-ignore
    movies: data.map(a => a.identifier),
    books: [],
    comics: [],
    series: [],
    games: [],
    excluded: {
      "movies": [],
      "games": [],
      "books": [],
      "comics": [],
      "series": []
    }
  }
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
