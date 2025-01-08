class BaseOrchestrator {
    constructor(
       private readonly modules
    ) {}

    public run(options: object): void {
        this.modules.forEach(module => module.execute(options));
    }
}

export default BaseOrchestrator;