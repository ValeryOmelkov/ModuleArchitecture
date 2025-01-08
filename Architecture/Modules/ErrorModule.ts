import Module from '../Module';

class ErrorModule extends Module {
    public execute(): void {
        console.log('ErrorModule');
        console.log(this.stateManager.get('complectId'));
    }
}

export default ErrorModule;