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
            orchestrator: Orchestrator
        } = metadata;

        const container = new DIContainer(modules);
        const moduleInstances = modules.map((module) => container.resolve(module));
        const orchestrator = new Orchestrator(moduleInstances);

        return new Controller(orchestrator);
    }
}