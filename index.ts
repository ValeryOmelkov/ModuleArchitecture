import { Memoize, Catch } from './method.js';
import { Singleton } from './class.js';


function Required(q) {
    console.log(q);
    return function (a, b, c, d) {
        console.log(a, b, c, d)
    }
}

@Singleton
class Demo {
    private readonly _count: number;

    constructor(count: number) {
        this._count = count;
    }

    getCount(@Required(2) n: number) {
        return this._count;
    }

    @Memoize()
    fib(n: number): number {
        if (n < 2) {
            return n;
        }
        return this.fib(n - 1) + this.fib(n - 2);
    }

    @Catch(function (this: Demo, error) { return this.logError(error) })
    test() {
        throw new Error('Ошибка');
    }

    logError<T>(error: T) {
        console.log('Ошибка поймана в методе класса: ' + error.message)
    }
}

const demo = new Demo(1);
demo.getCount(2);

