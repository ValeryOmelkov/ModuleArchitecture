function TrackChanges(target: any, context: ClassMethodDecoratorContext) {
    return function (this: any, key: string, value: any) {
        // console.log(target);
        // console.log(context);
        const previousValue = this.state[key]; // Сохраняем предыдущее значение
        console.log(this.constructor);
        if (!this.history[this.series]) {
            this.history[this.series] = [];
        }

        if (this.history[this.series] && Array.isArray(this.history[this.series])) {
            // Добавляем изменения на уровне ключа
            this.history[this.series].push({
                version: ++this.version,
                changes: {
                    [key]: {
                        previous: previousValue,
                        current: value
                    }
                },
            });
        }

        target.call(this, key, value);
    };
}

export default class StateManager {
    private state: Record<string, any> = {};
    private history = {};
    private version: number = 0;
    private series: number = 1; // Номер текущей серии
    private listeners: Record<string, ((value: any) => void)[]> = {};

    // Получение значения по ключу
    public get(key: string): any {
        return this.state[key];
    }

    // Установка значения по ключу
    @TrackChanges
    public set(key: string, value: any): void {
        this.state[key] = value;
        if (this.listeners[key]) {
            this.listeners[key].forEach((listener) => listener(value));
        }
    }

    // Подписка на изменения ключа
    public subscribe(key: string, listener: (value: any) => void): void {
        if (!this.listeners[key]) {
            this.listeners[key] = [];
        }
        this.listeners[key].push(listener);
    }

    // Отписка от изменений ключа
    public unsubscribe(key: string, listener: (value: any) => void): void {
        this.listeners[key] = this.listeners[key]?.filter((l) => l !== listener);
    }

    public getHistory(): any {
        return this.history;
    }
}