import { getConfig } from './config';

/**
 * Topic-based theme configurations for blog post OG images
 * Colors are loaded from config.yaml for centralized theming
 */

export interface BlogTheme {
  name: string;
  primaryColor: string;
  gradientStart: string;
  gradientEnd: string;
}

const topicNames: Record<string, string> = {
  tech: 'Technology',
  marketing: 'Marketing',
  entrepreneurship: 'Entrepreneurship',
  productivity: 'Productivity',
  health: 'Health',
};

/**
 * Get theme by topic name, loading colors from config.yaml
 * Falls back to main theme colors if topic not configured
 */
export function getThemeForTopic(topic: string): BlogTheme {
  const config = getConfig();
  const normalizedTopic = topic.toLowerCase();
  const topicName = topicNames[normalizedTopic] || topic;

  // Try to get topic-specific colors from config
  const blogThemeConfig = config.theme.blog[normalizedTopic as keyof typeof config.theme.blog];

  if (blogThemeConfig) {
    return {
      name: topicName,
      primaryColor: blogThemeConfig.primary,
      gradientStart: blogThemeConfig.gradientStart,
      gradientEnd: blogThemeConfig.gradientEnd,
    };
  }

  // Fallback to main theme colors
  return {
    name: topicName,
    primaryColor: config.theme.primary,
    gradientStart: config.theme.gradientStart,
    gradientEnd: config.theme.gradientEnd,
  };
}

/**
 * Get list of all available topics
 */
export function getAvailableTopics(): string[] {
  return Object.keys(topicNames);
}
