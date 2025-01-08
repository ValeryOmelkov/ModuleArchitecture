import ProgressModule from './ProgressModule';
import { Injectable } from '../Decorators/Injectable';
import Module from '../Module';

@Injectable([ProgressModule])
class CheckModule extends Module {
    constructor(
        private readonly progressModule: ProgressModule
    ) { super() }

    public execute(): void {
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