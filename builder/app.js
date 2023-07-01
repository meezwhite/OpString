import Alpine from './../node_modules/alpinejs/dist/module.esm.js';
import OpMapper from './../index.js';

window.Alpine = Alpine;

document.addEventListener('alpine:init', () => {
    Alpine.data('OpMapperBuilder', () => ({
        opMapper: null,

        init() {
            this.opMapper = new OpMapper({
                'A': ([x, y, d]) => {
                    console.log(`circle(${x}, ${y}, ${d})`);
                },
                'B': ([x, y, w, h]) => {
                    console.log(`rect(${x}, ${y}, ${w}, ${h})`);
                },
            }, {
                'a': 30,
                'b': 20,
                'c': 55,
            });

            // const input = 'AaabBaacc';
            // this.opMapper.decode(input);
            // this.opMapper.execute();
        },

        registerOperation(event) {
            console.debug('registerOperation');
        },

        registerMapping(event) {
            console.debug('registerMapping');
        },

        registerMappingRange(event) {
            console.debug('registerMappingRange');
        }
    }));
});

Alpine.start();