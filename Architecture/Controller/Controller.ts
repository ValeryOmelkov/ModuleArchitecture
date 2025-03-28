import Orchestrator from '../Orchestrators/Orchestrator';

export default abstract class Controller {
    constructor(protected readonly orchestrator: Orchestrator) {}
}