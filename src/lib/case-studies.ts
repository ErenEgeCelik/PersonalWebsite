import "server-only";
import { collection, type Doc, type DocMeta } from "./collection";

export type CaseStudyMeta = DocMeta;
export type CaseStudy = Doc;

const caseStudies = collection("case-studies", "Case study");

export function getAllCaseStudies(): CaseStudyMeta[] {
  return caseStudies.all();
}

export function getCaseStudy(slug: string): CaseStudy | null {
  return caseStudies.one(slug);
}
