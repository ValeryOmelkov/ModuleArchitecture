import SenderFactory from './Factory/SenderFactory';
import Partial from './Senders/Partial';
import { ReflectMetadata } from './Factory/ReflectMetadata';
import SendModule from './Modules/SendModule';

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

console.log(ReflectMetadata.getMetadata('sender:metadata', Partial));