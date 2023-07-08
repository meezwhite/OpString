import Alpine from './../node_modules/alpinejs/dist/module.esm.js';
import OpMapper from './../index.js';
// import { operationsStore, valuesStore } from './OpMapperStore.js';

window.Alpine = Alpine;
window.OpMapper = OpMapper;

document.addEventListener('alpine:init', () => {
    let opMapper;

    Alpine.data('OpMapperBuilder', () => ({
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
            opMapper = new OpMapper({
                operationsStore,
                valuesStore,
                ignoreWarnings: false,
                maxOperationsLength: 2000,
            });
            
            opMapper.storeOperation(72, (text) => {
                console.debug(text);
            });
            console.debug(opMapper);

            const operations = 'AaabBaacc';
            opMapper.execute(operations);
            opMapper.execute('Ga');
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
            return opMapper.operationsStore;
        },

        valuesStore() {
            return opMapper.valuesStore;
        },

        operationsSequence() {
            return opMapper.getOperationsSequence();
        },
    }));
});

Alpine.start();