import { Constructor } from '../Types/types';

const metadataStorage = new WeakMap<Constructor, Map<string, unknown>>();

export const ReflectMetadata = {
    defineMetadata<T>(metadataKey: string, metadataValue: T | T[], target: Constructor): void {
        let targetMetadata = metadataStorage.get(target);
        if (!targetMetadata) {
            targetMetadata = new Map();
            metadataStorage.set(target, targetMetadata);
        }
        targetMetadata.set(metadataKey, metadataValue);
    },
    getMetadata<T>(metadataKey: string, target: Constructor): T | T[] | undefined {
        const targetMetadata = metadataStorage.get(target);
        return targetMetadata?.get(metadataKey) as T | T[] | undefined;
    }
};