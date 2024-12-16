class ProgressModule {
    private currentStep: number = 0;

    public execute() {
        console.log('ProgressModule');
    }

    public showProgress(step: number) {
        this.currentStep += step;
        const progress = (this.currentStep / 10) * 100;
        console.log(`Прогресс: ${progress.toFixed(2)}%`);
    }
}

export default ProgressModule;