import { IModuleConfiguration, IModuleSpecification, ModuleType } from '../Configuration';
import StateManager from '../StateManager';
import Module from '../Module';
import { getModuleSpecification } from '../Utils/getModuleSpecification';
import Controller from '../Controller/Controller';

export default class SenderFactory {
    static create(controllerName: string, options: object): Promise<Controller> {
        return import('../Configuration').then(({ Configuration }) => {
            if (!Configuration.hasOwnProperty(controllerName)) {
                throw new Error(`Configuration for controller "${controllerName}" not found.`);
            }

            const configuration = Configuration[controllerName as keyof typeof Configuration];

            this.validateConfiguration(configuration);

            const {
                SequentialModules: sequentialModulesConfiguration,
                BackgroundModules: backgroundModulesConfiguration,
                Controller,
                Orchestrator,
                StateManager
            } = configuration;

            const stateManager = new StateManager();
            stateManager.set('controllerOptions', options);

            const backgroundModules: Map<string, Module> =  this.initializeBackgroundModules(
                backgroundModulesConfiguration as IModuleConfiguration[],
                stateManager
            );

            const orchestrator = new Orchestrator(
                stateManager,
                sequentialModulesConfiguration,
                backgroundModules
            );

            return new Controller(orchestrator);
        });
    }

    private static validateConfiguration(configuration) {
        const {
            SequentialModules: sequentialModules,
            BackgroundModules: backgroundModules,
            Controller,
            Orchestrator,
            StateManager
        } = configuration;

        if (!sequentialModules) {
            throw new Error('SequentialModules is not defined.');
        }

        if (!Controller) {
            throw new Error('Controller is not defined.');
        }

        if (!Orchestrator) {
            throw new Error('Orchestrator is not defined.');
        }

        if (!StateManager) {
            throw new Error('StateManager is not defined.');
        }

        const backgroundModulesSpecs: IModuleSpecification[] =
            this.getUniqueModules(this.extractModules(backgroundModules));
        const sequentialModulesSpecs: IModuleSpecification[] =
            this.getUniqueModules(Object.values(sequentialModules).flatMap(this.extractModules));

        this.checkDependencies(backgroundModulesSpecs, sequentialModulesSpecs);
        Object.values(sequentialModules).forEach(actionSequentialModules => {
            this.checkDuplicateModules([...actionSequentialModules, ...backgroundModules]);
        })

    }

    private static extractModules(modulesConfiguration: IModuleConfiguration[]): IModuleSpecification[] {
        return modulesConfiguration.flatMap((moduleConfig: IModuleConfiguration) => {
            const result = [];

            if (moduleConfig.module) {
                result.push(moduleConfig.module);
            }

            if (moduleConfig.type === ModuleType.Dynamic) {
                result.push(...moduleConfig.rules.map(({ module }) => module));
            }

            return result;
        });
    }

    private static getUniqueModules(modulesSpecs: IModuleSpecification[]): IModuleSpecification[] {
        return Array.from(
            new Map(modulesSpecs.map(
                (module: IModuleSpecification): [string, IModuleSpecification] => {
                    return [`${module.token}_${module.moduleRef}`, module]
                })
            ).values()
        );
    }

    private static checkDependencies(
        backgroundModules: IModuleSpecification[],
        sequentialModules: IModuleSpecification[]
    ): void {
        const sequentialModulesTokens = new Set(sequentialModules.map(
            (module: IModuleSpecification): string => module.token)
        );

        const backgroundModulesTokens = new Set(backgroundModules.map(
            (module: IModuleSpecification): string => module.token)
        );

        [...backgroundModules, ...sequentialModules]
            .forEach((module: IModuleSpecification) => {
                module.dependencies?.forEach((dependency: string) => {
                    if (module.token === dependency) {
                        throw new Error(`Module '${module.token}' has a dependency on itself`);
                    }

                    if (sequentialModulesTokens.has(dependency)) {
                        throw new Error(`Module '${module.token}' has a dependency on SequentialModule: '${dependency}'`);
                    }

                    if (!backgroundModulesTokens.has(dependency)) {
                        throw new Error(`Module '${module.token}' has unknown dependency: '${dependency}'`);
                    }
                });
            });
    }

    private static checkDuplicateModules(modulesConfigurations: IModuleConfiguration[]): void {
        const tokens = new Map();

        for (const configuration of modulesConfigurations) {
            if (configuration.type === ModuleType.Static) {
                if (tokens.has(configuration.module.token)) {
                    throw new Error(`Duplicate modules with the token "${configuration.module.token}" were found`);
                }

                tokens.set(configuration.module.token, configuration.type);
            } else if (configuration.type === ModuleType.Dynamic) {
                const uniqueTokens = new Set([
                    ...configuration.rules.map(({ module }) => module.token)
                ]);

                if (configuration.module) {
                    uniqueTokens.add(configuration.module.token);
                }

                uniqueTokens.forEach((token: string) => {
                    if (tokens.has(token) && uniqueTokens.size === 1) {
                        throw new Error(`Duplicate modules with the token "${token}" were found`);
                    }

                    if (tokens.has(token) && tokens.get(token) === ModuleType.Static) {
                        throw new Error(`Duplicate modules with the token "${token}" were found`);
                    }

                    if (tokens.has(token) && tokens.get(token) === ModuleType.Dynamic) {
                        console.warn(`Duplicate modules with the "${token}" token were found among dynamic configurations.`);
                    }

                    tokens.set(token, ModuleType.Dynamic);
                });
            } else {
                throw new Error(`Unknown or undeclared module configuration type`);
            }
        }
    }

    private static initializeBackgroundModules(
        backgroundModulesConfiguration: IModuleConfiguration[],
        stateManager: StateManager
    ): Map<string, Module> {
        const backgroundModules = new Map<string, Module>();
        const dependenciesQueue = new Map<string, Module[]>();

        if (!backgroundModulesConfiguration) {
            return backgroundModules;
        }

        backgroundModulesConfiguration.forEach((moduleConfiguration: IModuleConfiguration) => {
            const {
                token,
                moduleRef,
                dependencies
            } = getModuleSpecification(moduleConfiguration, stateManager);

            const module = new moduleRef();
            module.setState(stateManager);

            dependencies?.forEach((dependency: string) => {
                 if (backgroundModules.has(dependency)) {
                     module.setModule(dependency, backgroundModules.get(dependency));
                 } else {
                     if (dependenciesQueue.has(dependency)) {
                         dependenciesQueue.set(dependency, [
                             ...dependenciesQueue.get(dependency) as Module[],
                             module
                         ]);
                     } else {
                         dependenciesQueue.set(dependency, [module]);
                     }
                 }
            });

            if (dependenciesQueue.has(token)) {
                dependenciesQueue.get(token)?.forEach((module: Module) => {
                   module.setModule(token, module);
                });

                dependenciesQueue.delete(token);
            }

            backgroundModules.set(token, module);
        });

        return backgroundModules;
    }
}