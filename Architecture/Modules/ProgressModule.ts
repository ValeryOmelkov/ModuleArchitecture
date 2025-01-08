import Module from '../Module';

class ProgressModule extends Module {
    private currentStep: number = 0;

    public execute() {
        console.log('ProgressModule');
        this.stateManager.set('complectId', 666);
    }

    public showProgress(step: number) {
        this.currentStep += step;
        const progress = (this.currentStep / 10) * 100;
        console.log(`Прогресс: ${progress.toFixed(2)}%`);
    }
}

export default ProgressModule;