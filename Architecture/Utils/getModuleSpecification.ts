import { IModuleConfiguration, IModuleSpecification, ModuleType } from '../Configuration';
import StateManager from '../StateManager';

export function getModuleSpecification(
    moduleConfiguration: IModuleConfiguration,
    stateManager: StateManager
): IModuleSpecification {
    return moduleConfiguration.type === ModuleType.Static
        ? moduleConfiguration.module
        : getDynamicModuleSpecification(moduleConfiguration, stateManager);
}

export function getDynamicModuleSpecification(
    moduleConfiguration: IModuleConfiguration,
    stateManager: StateManager
): IModuleSpecification {
    const {
        rules,
        module
    } = moduleConfiguration;

    const conditionModule = (): IModuleSpecification | undefined => {
        for (const rule of rules) {
            if (rule.condition(stateManager)) {
                return rule.module;
            }
        }
    }

    return conditionModule() || module;
}