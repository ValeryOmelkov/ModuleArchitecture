import { ReflectMetadata } from '../Factory/ReflectMetadata';
import { Constructor } from '../Types/types';

interface IMetadata {
    modules: object,
    controller: object;
    orchestrator: any;
    stateManager: any;
}

export function Sender(metadata: IMetadata) {
    return function (target: Constructor) {
        ReflectMetadata.defineMetadata('sender:metadata', metadata, target);
    }
}