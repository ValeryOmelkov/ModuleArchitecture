export function Max(max: number) {
    return function(target, context) {
        return function(this, ...args) {
            if (args[0] > max) {
                throw new Error(`Значение больше чем ${ max }`);
            }
            return target.call(this, ...args);
        }
    }
}

export function Memoize(target?, context?) {
    const cache: Map<string, unknown> = new Map();

    const memoizeImplementation = (target, context) => {
        return function (...args) {
            const cacheKey = `${context.name}:${args.join(';')}`;
            if (cache.has(cacheKey)) {
                return cache.get(cacheKey);
            }

            const result = target.call(this, ...args);
            cache.set(cacheKey, result);
            return result;
        };
    }

    if (target) {
        return memoizeImplementation(target, context);
    }

    return function(target, context) {
        return memoizeImplementation(target, context);
    };
}

export function TimeExecution(target) {
    return function (...args) {
        const start: number = Date.now();
        const result = target.call(this, ...args);
        const end: number = Date.now();
        const timeExec = end - start;
        console.log('Время выполнения: ' + timeExec);
        return result;
    };
}

export function Catch<T>(errorHandler?: (error: T) => unknown) {
    return function (target) {
        return function (this, ...args) {
            try {
                return target.call(...args);
            } catch (error) {
                if (errorHandler) {
                    return errorHandler.call(this, error);
                }

                throw error;
            }
        }
    }
}