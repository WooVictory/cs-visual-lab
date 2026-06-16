import { networkContent } from "./content/network";
import { osContent } from "./content/os";
import { databaseContent } from "./content/database";
import { algorithmContent } from "./content/algorithm";
import { designPatternContent } from "./content/design-pattern";
import { languageContent } from "./content/language";
import { aiLlmContent } from "./content/ai-llm";
import { mobileContent } from "./content/mobile";
import { systemDesignContent } from "./content/system-design";
import { distributedContent } from "./content/distributed";
import { securityContent } from "./content/security";

export type KeyConcept = {
  term: string;
  definition: string;
};

export type TopicSidebarContent = {
  keyConcepts: KeyConcept[];
  interviewQuestions: string[];
};

export const topicSidebarContent: Record<string, TopicSidebarContent> = {
  ...aiLlmContent,
  ...mobileContent,
  ...networkContent,
  ...systemDesignContent,
  ...distributedContent,
  ...securityContent,
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
