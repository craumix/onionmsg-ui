var ytIdRegex = new RegExp(
  /(?:[?&]v=|\/embed\/|\/1\/|\/v\/|https:\/\/(?:www\.)?youtu\.be\/)([^&\n?#]+)/g
);

export interface YoutubeVideoMeta {
  provider_url: string;
  thumbnail_url: string;
  title: string;
  html: string;
  author_name: string;
  height: number;
  thumbnail_width: number;
  width: number;
  version: string;
  author_url: string;
  provider_name: string;
  type: string;
  thumbnail_height: number;
}

export function constructYoutbeLink(id: string): string {
  return "https://www.youtube.com/watch?v=" + id;
}

export function getYoutubeVideoMeta(id: string): Promise<YoutubeVideoMeta> {
  return fetch(
    "https://www.youtube.com/oembed?url=" +
      constructYoutbeLink(id) +
      "&format=json"
  ).then((res) => res.json());
}

export function findYoutubeIDs(text: string): string[] {
  let ids: string[] = [];
  let match: RegExpExecArray;
  do {
    match = ytIdRegex.exec(text);

    if (match) {
      ids.push(match[1]);
    }
  } while (match);

  return ids;
}
