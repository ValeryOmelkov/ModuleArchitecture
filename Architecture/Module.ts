import StateManager from './StateManager';

export default abstract class Module {
    protected state: StateManager;
    protected modules: { [key: string]: Module } = {};

    public setState(state: StateManager): void {
        this.state = state;
    }

    public setModule(token: string, module: Module): void {
        this.modules = {
            ...this.modules,
            [token]: module,
        };
    }

    abstract execute(): Promise<void> | void;
}