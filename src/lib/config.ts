import { readFileSync } from 'node:fs';
import { load as yamlLoad } from 'js-yaml';
import { join } from 'node:path';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface Config {
  app: {
    name: string;
    shortName: string;
    description: string;
    backgroundColor: string;
  };
  theme: {
    primary: string;
    gradientStart: string;
    gradientEnd: string;
    blog: {
      tech: {
        primary: string;
        gradientStart: string;
        gradientEnd: string;
      };
      marketing: {
        primary: string;
        gradientStart: string;
        gradientEnd: string;
      };
      entrepreneurship: {
        primary: string;
        gradientStart: string;
        gradientEnd: string;
      };
      productivity: {
        primary: string;
        gradientStart: string;
        gradientEnd: string;
      };
      health: {
        primary: string;
        gradientStart: string;
        gradientEnd: string;
      };
    };
  };
  seo: {
    defaultTitle: string;
    titleTemplate: string;
    defaultDescription: string;
    siteName: string;
    locale: string;
    type: string;
  };
  site: {
    url: string;
    author: string;
  };
  social: {
    twitter: string;
    github: string;
    discord: string;
    youtube: string;
    tiktok: string;
    linkedin: string;
    instagram: string;
    telegram: string;
    email: string;
    whatsapp: string;
  };
  legal: {
    contactEmail: string;
    dpoEmail?: string;
    companyName?: string;
  };
}

/**
 * Deep merge two objects
 */
function deepMerge<T>(target: T, source: DeepPartial<T>): T {
  const output = { ...target } as T;

  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = output[key];

    if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
      if (targetValue && typeof targetValue === 'object' && !Array.isArray(targetValue)) {
        output[key] = deepMerge(targetValue, sourceValue as DeepPartial<typeof targetValue>);
      } else {
        output[key] = sourceValue as T[Extract<keyof T, string>];
      }
    } else if (sourceValue !== undefined) {
      output[key] = sourceValue as T[Extract<keyof T, string>];
    }
  }

  return output;
}

/**
 * Convert environment variables with ATOMI_ prefix to config object
 * Example: ATOMI__APP__NAME becomes { app: { name: value } }
 */
function envToConfig(): DeepPartial<Config> {
  const config: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(process.env)) {
    if (!key.startsWith('ATOMI__') || !value) continue;

    // Remove ATOMI__ prefix and split by __
    const parts = key.substring(7).toLowerCase().split('__');

    let current: Record<string, unknown> = config;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!part) continue;

      if (!current[part]) {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }

    const lastPart = parts[parts.length - 1];
    if (lastPart) {
      current[lastPart] = value;
    }
  }

  return config as DeepPartial<Config>;
}

/**
 * Load hierarchical configuration:
 * 1. Load config.yaml (base)
 * 2. Merge config.<landscape>.yaml (landscape-specific)
 * 3. Merge environment variables (ATOMI__ prefix)
 */
export function loadConfig(): Config {
  const landscape = process.env.LANDSCAPE || process.env.ATOMI_LANDSCAPE || 'base';

  // Load base config
  const baseConfigPath = join(process.cwd(), 'config.yaml');
  let config: Config;

  try {
    const baseYaml = readFileSync(baseConfigPath, 'utf8');
    config = yamlLoad(baseYaml) as Config;
  } catch (error) {
    throw new Error(`Failed to load base config from ${baseConfigPath}: ${error}`);
  }

  // Load landscape-specific config if exists
  if (landscape !== 'base') {
    const landscapeConfigPath = join(process.cwd(), `config.${landscape}.yaml`);

    try {
      const landscapeYaml = readFileSync(landscapeConfigPath, 'utf8');
      const landscapeConfig = yamlLoad(landscapeYaml) as DeepPartial<Config>;
      config = deepMerge(config, landscapeConfig);
    } catch (error) {
      // Landscape config is optional, just log and continue
      console.warn(`No landscape config found at ${landscapeConfigPath}, using base config only`);
    }
  }

  // Merge environment variables
  const envConfig = envToConfig();
  config = deepMerge(config, envConfig);

  return config;
}

// Export singleton instance
let configInstance: Config | null = null;

export function getConfig(): Config {
  if (!configInstance) {
    configInstance = loadConfig();
  }
  return configInstance;
}
