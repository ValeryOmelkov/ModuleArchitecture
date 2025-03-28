import SenderFactory from './Architecture/Factory/SenderFactory';

/**
 * TODO
 * Оркестрация и порядок выполнения модулей
 *
 */

SenderFactory.create('Standard', {}).then((sender) => {
    sender.send({});
});
