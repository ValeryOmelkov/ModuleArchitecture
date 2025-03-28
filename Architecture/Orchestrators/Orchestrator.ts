import StateManager from '../StateManager';
import Module from '../Module';
import { IModuleConfiguration } from '../Configuration';
import { getModuleSpecification } from '../Utils/getModuleSpecification';

export default class Orchestrator {
    constructor(
        protected readonly state: StateManager,
        protected readonly sequentialModulesConfiguration: IModuleConfiguration[],
        protected readonly backgroundModules: Map<string, Module>
    ) {}

    public async run(action: string, options: object): Promise<void> {
        this.state.set('action', action);
        this.state.set('sessionOptions', options);

        if (typeof this.beforeExecute === "function") {
            await this.beforeExecute();
        }

        this.executeBackgroundModules(action);
        await this.executeSequentialModules(action);

        if (typeof this.afterExecute === "function") {
            await this.afterExecute();
        }
    }

    protected abstract beforeExecute(): Promise<void> | void;
    protected abstract afterExecute(): Promise<void> | void;

    private executeBackgroundModules(action: string): void {
        this.backgroundModules.forEach((module) => {
            module.execute();
        });
    }

    private async executeSequentialModules(action: string): Promise<void> {
        for (const moduleConfiguration of this.sequentialModulesConfiguration[action]) {
            const module = this.initializeModule(moduleConfiguration);
            if (module) {
                await module.execute();
            }
        }
    }

    private initializeModule(moduleConfiguration: IModuleConfiguration): Module | null {
        const moduleSpecification = getModuleSpecification(moduleConfiguration, this.state);
        if (!moduleSpecification) {
            return null;
        }

        const {
            moduleRef,
            dependencies
        } = moduleSpecification;

        const module = new moduleRef();
        module.setState(this.state);

        dependencies.forEach((dependency) => {
            if (this.backgroundModules.has(dependency)) {
                module.setModule(this.backgroundModules.get(dependency));
            }
        });

        return module;
    }
}