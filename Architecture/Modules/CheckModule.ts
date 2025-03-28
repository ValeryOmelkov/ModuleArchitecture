import ProgressModule from './ProgressModule';
import { Injectable } from '../Decorators/Injectable';
import Module from '../Module';

class CheckModule extends Module {
    public async execute(): Promise<void> {
        console.log('CheckModule');
        const timeouts = [
            this.delay(2000).then(() => this.state.set('progress', 50)),
            this.delay(4000).then(() => this.state.set('progress', 60)),
            this.delay(6000).then(() => this.state.set('progress', 70)),
            this.delay(8000).then(() => this.state.set('progress', 80)),
            this.delay(10000).then(() => this.state.set('progress', 90)),
            this.delay(12000).then(() => this.state.set('progress', 100)),
        ];

        await Promise.all(timeouts);
    }

    delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default CheckModule;