import ProgressModule from './ProgressModule';
import { Injectable } from '../Decorators/Injectable';
import ErrorModule from './ErrorModule';
import Module from '../Module';

@Injectable([ErrorModule, ProgressModule])
class SendModule extends Module {
    constructor(
        private readonly errorModule: ErrorModule,
        private readonly progressModule: ProgressModule
    ) { super() }

    public execute(): void {
        console.log('SendModule');
    }
}

export default SendModule;