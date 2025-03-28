import Module from '../Module';

class ProgressModule extends Module {
    private currentStep: number = 0;

    public execute() {
        console.log('ProgressModule');
        this.state.subscribe('progress', this.showProgress)
    }

    public showProgress(progress: number) {
        console.log(`Прогресс: ${progress}%`);
    }
}

export default ProgressModule;