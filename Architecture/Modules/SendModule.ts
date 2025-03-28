import ProgressModule from './ProgressModule';
import { Injectable } from '../Decorators/Injectable';
import ErrorModule from './ErrorModule';
import Module from '../Module';

class SendModule extends Module {
    public async execute(): Promise<void> {
        console.log('SendModule');
        const timeouts = [
            this.delay(2000).then(() => this.state.set('progress', 0)),
            this.delay(4000).then(() => this.state.set('progress', 10)),
            this.delay(6000).then(() => this.state.set('progress', 20)),
            this.delay(8000).then(() => this.state.set('progress', 30)),
            this.delay(10000).then(() => this.state.set('progress', 40)),
        ];

        await Promise.all(timeouts);
    }

    delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default SendModule;