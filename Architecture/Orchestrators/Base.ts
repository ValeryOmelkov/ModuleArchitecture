import Orchestrator from './Orchestrator';
import { IModuleConfiguration } from '../Configuration';
import Module from '../Module';
import { getModuleSpecification } from '../Utils/getModuleSpecification';


// TODO Идеи
// 1. Откат назад
// 3. Обработка ошибок
// 4. Прерывание работы
class BaseOrchestrator extends Orchestrator {
    protected afterExecute(): void {
        console.log(JSON.stringify(this.state.getHistory()));
    }
}

export default BaseOrchestrator;