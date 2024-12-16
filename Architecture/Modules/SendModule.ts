import ProgressModule from './ProgressModule';
import { Injectable } from '../Decorators/Injectable';
import ErrorModule from './ErrorModule';

@Injectable([ErrorModule, ProgressModule])
class SendModule {
    constructor(
        private readonly errorModule: ErrorModule,
        private readonly progressModule: ProgressModule
    ) {}

    public execute(): void {
        console.log(this.errorModule);
        // let step = 0;
        // return new Promise((resolve) => {
        //     const update = () => {
        //         if (step < 6) {
        //             this.progressModule.showProgress(1);
        //             setTimeout(update, 1000);
        //         } else {
        //             resolve(2);
        //         }
        //     }
        //
        //     setTimeout(update, 1000);
        // });
    }
}

const as = new SendModule({}, {})

export default SendModule;