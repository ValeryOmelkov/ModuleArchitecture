import Module from '../Module';

class ErrorModule extends Module {
    public execute(): void {
        console.log('ErrorModule');
    }
}

export default ErrorModule;