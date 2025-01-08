import SenderFactory from './Architecture/Factory/SenderFactory';
import Partial from './Architecture/Senders/Partial';

/**
 * TODO
 * Оркестрация и порядок выполнения модулей
 *
 */

const sender = SenderFactory.create(Partial, {
    name: 'Partial'
});

sender.send({
    complectIds: [1, 2, 3, 4, 5],
    check: true,
    clientData: {
        111: [222, 333],
        444: [555, 666]
    }
});