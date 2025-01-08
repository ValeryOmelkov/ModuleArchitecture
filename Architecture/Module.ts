export default abstract class Module {
    protected options;
    protected stateManager;

    public setOptions<T>(options: T): void {
        this.options = options;
    }

    public setStateManager<T>(stateManager: T): void {
        this.stateManager = stateManager;
    }

    abstract execute<T>(options: T): void;
}