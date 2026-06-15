import { networkContent } from "./content/network";
import { osContent } from "./content/os";
import { databaseContent } from "./content/database";
import { algorithmContent } from "./content/algorithm";
import { designPatternContent } from "./content/design-pattern";
import { languageContent } from "./content/language";

export type KeyConcept = {
  term: string;
  definition: string;
};

export type TopicSidebarContent = {
  keyConcepts: KeyConcept[];
  interviewQuestions: string[];
};

export const topicSidebarContent: Record<string, TopicSidebarContent> = {
  ...networkContent,
  ...osContent,
  ...databaseContent,
  ...algorithmContent,
  ...designPatternContent,
  ...languageContent,
};

export function getTopicSidebarContent(
  slug: string
): TopicSidebarContent | undefined {
  return topicSidebarContent[slug];
}
