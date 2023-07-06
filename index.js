/**!
 * OpMapper
 * @version 0.1.0
 * @license MIT
 * @copyright meezwhite
 */
export default class OpMapper {
    version = '0.1.0';

    // operationsStore;
    // valuesStore;
    // ignoreWarnings;

    #minSymbolCode;
    #maxSymbolCode;
    #maxOperationsLength;

    /**
     * Initialize an OpMapper instance.
     * 
     * @param {Object} [config] The config object to configure OpMapper features.
     * @param {Object} config.operationsStore The initial object storing operation mappings.
     * @param {Object} config.valuesStore The initial object storing value mappings.
     * @param {Boolean} [config.ignoreWarnings] Specifies whether warnings should be ignored. (default: false)
     * @param {Number} [config.minSymbolCode] Specifies the minimum allowed UTF-16 code unit of a character.
     *     If defined, it must be a positive integer and smaller than `config.maxSymbolCode`. (default: 0)
     * @param {Number} [config.maxSymbolCode] Specifies the maximum allowed UTF-16 code unit of a character.
     *     If defined, it must be a positive integer and bigger than `config.minSymbolCode`. (default: 65535)
     * @param {Number} [config.maxOperationsLength] Specifies a maximum operations sequence length guideline.
     *     If defined, it must be a positive safe integer. (default: undefined)
     */
    constructor(config = {}) {
        console.debug('constructor arguments:', arguments);
        this.#validateArguments('constructor', arguments);
        this.operationsStore = config.operationsStore;
        this.valuesStore = config.valuesStore;
        this.ignoreWarnings = config.ignoreWarnings ?? false;
        this.#minSymbolCode = config.minSymbolCode ?? 0;
        this.#maxSymbolCode = config.maxSymbolCode ?? 65535;
        this.#maxOperationsLength = config.maxOperationsLength ?? undefined;
    }

    /**
     * Store an operation mapping.
     * 
     * @method storeOperation
     * 
     * @param {string|number} symbol The character or character code that should be mapped to a function.
     * @param {function} fn The function that the symbol should be mapped to.
     */
    storeOperation(symbol, fn) {
        this.#validateArguments('storeOperation', arguments);
        if (typeof symbol === 'string') {
            this.operationsStore[symbol.charCodeAt(0)] = fn;
        } else if (typeof symbol === 'number') {
            this.operationsStore[symbol] = fn;
        }
    }

    /**
     * Store a value mapping.
     * 
     * @method storeValue
     * 
     * @param {string|number} symbol The character or character code that should be mapped to a function.
     * @param {function} fn The function that the symbol should be mapped to.
     */
    storeValue(symbol, value) {
        this.#validateArguments('storeValue', arguments);
        if (typeof symbol === 'string') {
            this.valuesStore[symbol.charCodeAt(0)] = value;
        } else if (typeof symbol === 'number') {
            this.valuesStore[symbol] = value;
        }
    }

    /**
     * Execute an operations sequence.
     * 
     * @method execute
     * 
     * @param {string} operations The operations sequence that should be executed.
     */
    execute(operations) {
        this.#validateArguments('execute', arguments);
        for (let i = 0; i < operations.length; i++) {
            const symbol = operations[i];
            const operation = this.operationsStore[symbol];
            if (operation) {
                const args = [];
                for (let j = i+1; j < operations.length; j++) {
                    const mapping = this.valuesStore[operations[j]];
                    if (mapping) {
                        args.push(mapping);
                    } else {
                        break;
                    }
                }
                operation(...args);
            }
        }
    }

    /**
     * Checks the validity of the arguments of the respective method.
     * 
     * @private
     * @method validateArguments
     * 
     * @param {String} method Name of the method
     * @param {Array} args User given arguments to the respective method
     */
    #validateArguments(method, args) {
        switch (method) {
            case 'constructor':
                console.debug(args);
                break;

            case 'storeOperation':
            case 'storeValue':
                const isString = typeof args[0] === 'string';
                const isNumber = typeof args[0] === 'number';
                if (! isString && ! isNumber) {
                    throw new Error(`[OpMapper] Unable to ${method} with symbol "${symbol}". A symbol must be of type string or number.`);
                }
                if (isString && args[0].length !== 1) {
                    throw new Error(`[OpMapper] Unable to ${method} with symbol "${symbol}". A symbol of type string must be a single character.`);
                } else if (
                    isNumber
                    && (
                        ! Number.isInteger(args[0])
                        || args[0] < this.#minSymbolCode
                        || args[0] > this.#maxSymbolCode
                    )
                ) {
                    throw new Error(`[OpMapper] Unable to ${method} with symbol "${symbol}". A symbol of type number must be an integer between ${this.#minSymbolCode} and ${this.#maxSymbolCode}.`);
                }
                break;

            case 'execute':
                if (typeof args[0] !== 'string') {
                    throw new Error(`[OpMapper] Unable to execute the provided operations sequence "${args[0]}". An operation must be of type string.`);
                }
                if (
                    ! this.ignoreWarnings
                    && this.#maxOperationsLength
                    && args[0].length > this.#maxOperationsLength
                ) {
                    console.warn(`[OpMapper] The provided operations sequence exceeds the maxOperationsLength guideline of ${this.#maxOperationsLength} characters.`);
                }
                break;
            
            default: break;
        }
    }
}