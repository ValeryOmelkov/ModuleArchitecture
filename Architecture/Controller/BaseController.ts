import ProgressModule from '../Modules/ProgressModule';
import BaseOrchestrator from '../Orchestrators/Base';

export default class BaseController {
    constructor(private readonly orchestrator: BaseOrchestrator) {}

    async send(options: object) {
        this.orchestrator.run(options);
    }
}