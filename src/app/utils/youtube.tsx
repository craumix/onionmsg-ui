const ytIdRegex = new RegExp(
  /(?:[?&]v=|\/embed\/|\/1\/|\/v\/|https:\/\/(?:www\.)?youtu\.be\/)([^&\n?#]+)(?:[\?\&]t=([0-9]*))?/g
);

/*
Old: /(?:[?&]v=|\/embed\/|\/1\/|\/v\/|https:\/\/(?:www\.)?youtu\.be\/)([^&\n?#]+)/g
New: /(?:[?&]v=|\/embed\/|\/1\/|\/v\/|https:\/\/(?:www\.)?youtu\.be\/)([^&\n?#]+)(?:(?:[\?\&]t=)([0-9]*))?/g
*/

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

export function constructYoutubeLink(id: string, start?: number): string {
  return "https://www.youtube.com/watch?v=" + id + (start ? "&t=" + start : "");
}

export function getYoutubeVideoMeta(id: string): Promise<YoutubeVideoMeta> {
  return fetch(
    "https://www.youtube.com/oembed?url=" +
      constructYoutubeLink(id) +
      "&format=json"
  ).then((res) => res.json());
}

export function findYoutubeIDs(text: string): [string, number][] {
  const ids: [string, number][] = [];
  let match: RegExpExecArray;
  do {
    match = ytIdRegex.exec(text);

    if (match) {
      ids.push([match[1], +match[2] ?? 0]);
    }
  } while (match);

  return ids;
}
