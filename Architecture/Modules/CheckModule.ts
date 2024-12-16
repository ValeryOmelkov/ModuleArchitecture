import ProgressModule from './ProgressModule';
import { Injectable } from '../Decorators/Injectable';

@Injectable([ProgressModule])
class CheckModule {
    constructor(
        private readonly progressModule: ProgressModule
    ) {}

    public execute(): Promise<void> {
        console.log('CheckModule');
        // let step = 0;
        // return new Promise((resolve) => {
        //     const update = () => {
        //         if (step < 4) {
        //             this.progressModule.showProgress(1);
        //             setTimeout(update, 1000);
        //         } else {
        //             resolve(1);
        //         }
        //     }
        //
        //     setTimeout(update, 1000);
        // });
    }
}

export default CheckModule;