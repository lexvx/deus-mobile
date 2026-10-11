/* eslint-disable @nx/enforce-module-boundaries */

import { appStorageService } from '@open-webui-react-native/shared/data-access/storage';
import { appEnv } from '@open-webui-react-native/shared/utils/app-env';

export const ronasApiUrl = appEnv.select({
  development: 'https://ai.lex42.ru',
  staging: 'https://ai.lex42.ru',
  production: 'https://ai.lex42.ru',
});

export const testApiUrl = 'https://deus.invalid';

const normalizeUrl = (url?: string): string => (url ?? '').trim().replace(/\/+$/, '');

export const resolveApiUrl = (url: string): string => {
  const normalized = normalizeUrl(url);
  if (normalized !== 'https://ai.lex42.ru') throw new Error('Этот клиент подключается только к https://ai.lex42.ru');
  return normalized;
};

export const isTestApiUrl = (url?: string): boolean =>
  normalizeUrl(url ?? appStorageService.apiUrl.get()) === normalizeUrl(testApiUrl);

export const getDisplayApiUrl = (): string => {
  const stored = normalizeUrl(appStorageService.apiUrl.get());
  const fallback = normalizeUrl(ronasApiUrl);

  return stored || fallback;
};

export const getApiUrl = (): string => {
  return resolveApiUrl(getDisplayApiUrl());
};

export const getHost = (url: string): string =>
  url
    .replace(/^https?:\/\//, '')
    .split('/')[0]
    .toLowerCase();

