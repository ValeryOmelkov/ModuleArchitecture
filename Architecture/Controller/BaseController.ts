import Orchestrator from '../Orchestrators/Orchestrator';
import Controller from './Controller';

export default class BaseController extends Controller{
    async send(options: object) {
        this.orchestrator.run('send', options);
    }

    async check(options: object) {
        this.orchestrator.run('check', options);
    }
}