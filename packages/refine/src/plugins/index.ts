import { IProviderPlugin } from 'k8s-api-provider';
import { modelPlugin } from './model-plugin';
import { relationPlugin } from './relation-plugin';
export * from './model-plugin';
export * from './relation-plugin';

export const ProviderPlugins = [relationPlugin, modelPlugin] as IProviderPlugin[];
