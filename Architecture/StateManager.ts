export default class StateManager {
    private state: Record<string, any> = {};
    private listeners: Record<string, ((value: any) => void)[]> = {};

    // Получение значения по ключу
    public get(key: string): any {
        return this.state[key];
    }

    // Установка значения по ключу
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
}