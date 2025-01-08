import { Sender } from '../Decorators/Sender';
import ProgressModule from '../Modules/ProgressModule';
import CheckModule from '../Modules/CheckModule';
import SendModule from '../Modules/SendModule';
import BaseOrchestrator from '../Orchestrators/Base';
import BaseController from '../Controller/BaseController';
import ErrorModule from '../Modules/ErrorModule';
import StateManager from '../StateManager';

@Sender({
    modules: [
        ProgressModule,
        CheckModule,
        SendModule,
        ErrorModule
    ],
    controller: BaseController,
    orchestrator: BaseOrchestrator,
    stateManager: StateManager
})
class Partial {}

export default Partial;