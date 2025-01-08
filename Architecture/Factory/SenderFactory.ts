import { ReflectMetadata } from './ReflectMetadata';
import { Constructor } from '../Types/types';
import DIContainer from '../DIContainer';

export default class SenderFactory {
    static create(target: Constructor, options: object) {
        const metadata = ReflectMetadata.getMetadata('sender:metadata', target);
        if (!metadata) {
            throw new Error('Метаданные не найдены');
        }

        const {
            modules,
            controller: Controller,
            orchestrator: Orchestrator,
            stateManager: StateManager
        } = metadata;

        const container = new DIContainer(modules);
        const stateManager = new StateManager();
        const moduleInstances = modules.map((module) => container.resolve(module));
        moduleInstances.map((module) => {
            module.setOptions(options);
            module.setStateManager(stateManager);
        })
        const orchestrator = new Orchestrator(moduleInstances);

        return new Controller(orchestrator);
    }
}