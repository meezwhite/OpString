/**!
 * OpMapper
 * @version 0.1.0
 * @license MIT
 * @copyright meezwhite
 */
export default class OpMapper {
    version = '0.1.0';
    decodedOperations = [];

    constructor(operations = {}, mappings = {}) {
        this.operations = operations;
        this.mappings = mappings;
    }

    registerOperation(char, fn) {
        this.operations[char] = fn;
    }

    registerMapping(char, value) {
        this.mappings[char] = value;
    }

    decode(input) {
        for (let i = 0; i < input.length; i++) {
            const char = input[i];
            const operation = this.operations[char];
            if (operation) {
                const args = [];
                for (let j = i+1; j < input.length; j++) {
                    const mapping = this.mappings[input[j]];
                    if (mapping) {
                        args.push(mapping);
                    } else {
                        break;
                    }
                }
                this.decodedOperations.push({ operation: char, args });
            }
        }
    }

    execute() {
        for (const { operation, args } of this.decodedOperations) {
            if (this.operations[operation]) {
                this.operations[operation](args);
            }
        }
    }
}