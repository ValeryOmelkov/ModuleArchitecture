export default class DIContainer {
    private registry = new Map();

    constructor(targets: any[]) {
        targets.forEach((target: any) => this.register(target));
    }

    register(target: any) {
        if (this.registry.has(target)) {
            throw new Error(`Token "${target}" уже зарегистрирован.`);
        }

        this.registry.set(target, target);
    }

    resolve<T>(token: T): T {
        const registered = this.registry.get(token);

        if (!registered) {
            throw new Error(`Constructor not found for token: ${token}`);
        }

        if (typeof registered === 'function') {
            return this.instantiate<T>(registered);
        }

        return registered;
    }

    // Создание экземпляра с внедрением зависимостей
    private instantiate<T>(clazz: Constructor): T {
        // Получаем метаданные о параметрах конструктора
        const paramTypes: Constructor[] = ReflectMetadata.getMetadata<Constructor>(
            'sender:paramtypes',
            clazz
        ) as Constructor[] || [];

        // Рекурсивно разрешаем зависимости
        const dependencies = paramTypes.map(param => this.resolve(param));

        return new clazz(...dependencies);
    }
}