import type { Config } from '../types/cognito';

const defaultConfig: Config = {
  cognito: {
    userPoolId: 'placeholder',
    userPoolClientId: 'placeholder',
    identityPoolId: 'placeholder',
    domain: 'placeholder',
    region: 'placeholder',
  },
  cloudfront: {
    domain: 'placeholder',
  },
  apiUrl: 'placeholder',
  staticSiteDomainName: 'placeholder',
};

let config: Config | null = null;

export async function loadConfig(): Promise<Config> {
  try {
    const response = await fetch('/config.json');
    if (!response.ok) {
      throw new Error('Failed to load config.json');
    }
    const loadedConfig = await response.json();
    config = loadedConfig;
    return loadedConfig;
  } catch (error) {
    console.error('Error loading config:', error);
    return defaultConfig;
  }
}

export function getConfig(): Config {
  if (!config) {
    throw new Error('Config not loaded - call waitForConfig first');
  }
  return config;
}

export async function waitForConfig(): Promise<Config> {
  if (!config) {
    return await loadConfig();
  }
  return config;
}

export function getCognitoConfig() {
  return getConfig().cognito;
}

export function getCloudFrontDomain(): string {
  return getConfig().cloudfront.domain;
}

export function isUsingLocalApi(): boolean {
  return import.meta.env.VITE_USE_LOCAL_API === 'true';
}

// Initialize config loading as soon as possible in browser
loadConfig().catch(console.error);
