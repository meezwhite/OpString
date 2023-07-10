import Alpine from './../node_modules/alpinejs/dist/module.esm.js';
import OpString from './../index.js';
// import { operationsStore, valuesStore } from './OpStringStore.js';

window.Alpine = Alpine;
window.OpString = OpString;

document.addEventListener('alpine:init', () => {
    let opString;

    Alpine.data('OpStringBuilder', () => ({
        init() {
            const operationsStore = {
                'A': (x, y, d) => {
                    console.log(`circle(${x}, ${y}, ${d})`);
                },
                'B': (x, y, w, h) => {
                    console.log(`rect(${x}, ${y}, ${w}, ${h})`);
                },
            };
            const valuesStore = {
                'a': 30,
                'b': 20,
                'c': 55,
            };
            opString = new OpString({
                operationsSequence: 'AaabBaaGccAbba',
                operationsStore,
                valuesStore,
            });
            console.debug(opString.getOperationsSequenceData());

            opString.execute();
            // opString.execute('Aaac');
        },

        storeOperation(event) {
            console.debug('storeOperation');
        },

        storeValue(event) {
            console.debug('storeValue');
        },

        storeValuesRange(event) {
            console.debug('storeValuesRange');
        },

        operationsStore() {
            return opString.operationsStore;
        },

        valuesStore() {
            return opString.valuesStore;
        },

        operationsSequence() {
            return opString.getOperationsSequence();
        },
    }));
});

Alpine.start();