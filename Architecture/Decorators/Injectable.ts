import { ReflectMetadata } from '../Factory/ReflectMetadata';
import { Constructor } from '../Types/types';

export function Injectable(dependencies: Constructor[] = []) {
    return function (target: Constructor) {
        ReflectMetadata.defineMetadata('sender:paramtypes', dependencies, target);
    }
}