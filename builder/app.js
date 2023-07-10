import Alpine from './../node_modules/alpinejs/dist/module.esm.js';
import OpString from './../index.js';
// import { operations, values } from './OpStringStore.js';

window.Alpine = Alpine;
window.OpString = OpString;

document.addEventListener('alpine:init', () => {
    let opString;

    Alpine.data('OpStringBuilder', () => ({
        init() {
            const operations = {
                'A': (x, y, d) => {
                    console.log(`circle(${x}, ${y}, ${d})`);
                },
                'B': (x, y, w, h) => {
                    console.log(`rect(${x}, ${y}, ${w}, ${h})`);
                },
            };
            const values = {
                'a': 30,
                'b': 20,
                'c': 55,
            };
            opString = new OpString({
                sequence: 'AaabBaaGccAbba',
                operations,
                values,
            });
            console.debug(opString);

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

        operations() {
            return opString.operations;
        },

        values() {
            return opString.values;
        },

        sequence() {
            return opString.sequence;
        },
    }));
});

Alpine.start();