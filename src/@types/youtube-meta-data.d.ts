// src/@types/youtube-meta-data.d.ts
declare module "youtube-meta-data" {
  interface EmbedInfo {
    title: string;
    author_name: string;
    author_url: string;
    type: string;
    height: number;
    width: number;
    version: string;
    provider_name: string;
    provider_url: string;
    thumbnail_height: number;
    thumbnail_width: number;
    thumbnail_url: string;
    html: string;
  }

  interface YoutubeMetaData {
    title: string;
    description: string;
    keywords: string;
    shortlinkUrl: string;
    embedinfo: EmbedInfo;
    videourl: string;
  }

  function youtubeMetaData(url: string): Promise<YoutubeMetaData>;

  export default youtubeMetaData;
}
