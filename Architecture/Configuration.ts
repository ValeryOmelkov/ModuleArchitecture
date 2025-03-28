import ProgressModule from './Modules/ProgressModule';
import CheckModule from './Modules/CheckModule';
import SendModule from './Modules/SendModule';
import ErrorModule from './Modules/ErrorModule';
import BaseController from './Controller/BaseController';
import StateManager from './StateManager';
import Orchestrator from './Orchestrators/Orchestrator';
import BaseOrchestrator from './Orchestrators/Base';

export interface IModuleSpecification {
    token: string;
    moduleRef: any;
    dependencies: string[];
}

export interface IModuleConfiguration {
    type: string;
    module?: IModuleSpecification;
    rules?: {
        condition: (stateManager: StateManager) => boolean;
        module?: IModuleSpecification;
    }[];
}

const Token = {
    Progress: 'progress',
    Check: 'check',
    Send: 'send',
    ErrorManager: 'errorManager'
}

const ModuleRegistry = {
    ProgressAccountantStandard: {
        token: Token.Progress,
        moduleRef: ProgressModule
    },
    Check: {
        token: Token.Check,
        moduleRef: CheckModule,
        dependencies: [Token.Progress]
    },
    CheckAdvanced: {
        token: Token.Check,
        moduleRef: CheckModule,
        dependencies: [Token.Progress]
    },
    Send: {
        token: Token.Send,
        moduleRef: SendModule,
        dependencies: [Token.Progress]
    },
    ErrorManager: {
        token: Token.ErrorManager,
        moduleRef: ErrorModule,
        dependencies: [Token.Progress]
    },
    ErrorManagerAdvanced: {
        token: Token.ErrorManager,
        moduleRef: ErrorModule
    }
};

export const ModuleType = {
    Static: 'static',
    Dynamic: 'dynamic'
};

export const Configuration = {
    Standard: {
        SequentialModules: {
            send: [
                { type: ModuleType.Static, module: ModuleRegistry.Send },
                {
                    type: ModuleType.Dynamic,
                    rules: [
                        {
                            condition: () => {
                                return false;
                            },
                            module: ModuleRegistry.Check
                        }, {
                            condition: () => {
                                return false;
                            },
                            module: ModuleRegistry.CheckAdvanced
                        }
                    ]
                }
            ],
            check: [
                { type: ModuleType.Static, module: ModuleRegistry.Check },
            ]
        },
        BackgroundModules: [
            {
                type: ModuleType.Static,
                module: ModuleRegistry.ProgressAccountantStandard,
                actions: ['send', 'check']
            },
            {
                type: ModuleType.Dynamic,
                rules: [
                    { condition: () => { return false; }, module: ModuleRegistry.ErrorManager },
                    { condition: () => { return true; }, module: ModuleRegistry.ErrorManagerAdvanced }
                ],
                module: ModuleRegistry.ErrorManager
            }
        ],
        Controller: BaseController,
        Orchestrator: BaseOrchestrator,
        StateManager: StateManager
    },
    Bulk: {
        SequentialModules: [
            { type: ModuleType.Static, module: ModuleRegistry.Send },
            {
                type: ModuleType.Dynamic,
                rules: [
                    { condition: () => { return false; }, module: ModuleRegistry.Check },
                    { condition: () => { return true; }, module: ModuleRegistry.CheckAdvanced }
                ],
                module: ModuleRegistry.Check
            }
        ],
        BackgroundModules: [
            { type: ModuleType.Static, module: ModuleRegistry.ProgressAccountantStandard },
            { type: ModuleType.Static, module: ModuleRegistry.ErrorManager }
        ],
        Controller: BaseController,
        Orchestrator: Orchestrator,
        StateManager: StateManager
    }
}