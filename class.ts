export function Singleton<T extends { new (...args: unknown[]): {} }>(constructor: T) {
    let instance: T;

    return class extends constructor {
        constructor(this: T, ...args: unknown[]) {
            if (!instance) {
                super(...args);
                instance = this;
            }

            return instance;
        }
    };
}