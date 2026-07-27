import "server-only";
import { collection, type Doc, type DocMeta } from "./collection";

export type WhitepaperMeta = DocMeta;
export type Whitepaper = Doc;

const whitepapers = collection("whitepapers", "Draft");

export function getAllWhitepapers(): WhitepaperMeta[] {
  return whitepapers.all();
}

export function getWhitepaper(slug: string): Whitepaper | null {
  return whitepapers.one(slug);
}
