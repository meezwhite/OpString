/**!
 * OpMapper
 * 
 * @version 0.1.0
 * @license MIT
 * @copyright meezwhite
 */
export default class OpMapper {
    version = '0.1.0';

    operationsStore = {};
    valuesStore = {};
    ignoreWarnings = false;

    #minSymbolCode = 0;
    #maxSymbolCode = 65535;
    #maxOperationsLength;

    #validConfigKeys = [
        'operationsStore',
        'valuesStore',
        'ignoreWarnings',
        'maxOperationsLength',
    ];

    /**
     * Creates an instance of OpMapper.
     * 
     * @param {Object} [config] Config object to configure OpMapper features.
     * @param {Object} [config.operationsStore] Initial object storing operation mappings. (default: {})
     * @param {Object} [config.valuesStore] Initial object storing value mappings. (default: {})
     * @param {boolean} [config.ignoreWarnings] Specifies whether warnings should be ignored. (default: false)
     * @param {number} [config.maxOperationsLength] Specifies a maximum operations sequence length guideline.
     *     If defined, it must be a positive safe integer. (default: undefined)
     */
    constructor(config) {
        this.#validateArguments('constructor', arguments);
        if (this.#isValidStoreObject(config)) {
            if (this.#isValidStoreObject(config.operationsStore)) {
                for (const [symbol, fn] of Object.entries(config.operationsStore)) {
                    this.storeOperation(symbol, fn);
                }
            }
            if (this.#isValidStoreObject(config.valuesStore)) {
                for (const [symbol, value] of Object.entries(config.valuesStore)) {
                    this.storeValue(symbol, value);
                }
            }
            if (typeof config.ignoreWarnings === 'boolean') {
                this.ignoreWarnings = config.ignoreWarnings;
            }
            if (this.#isValidMaxOperationsLength(config.maxOperationsLength)) {
                this.#maxOperationsLength = config.maxOperationsLength;
            }
        }
    }

    /**
     * Stores an operation mapping.
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
     * Stores a value mapping.
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
     * Executes an operations sequence.
     * 
     * @method execute
     * 
     * @param {string} operations The operations sequence that should be executed.
     */
    execute(operations) {
        this.#validateArguments('execute', arguments);
        for (let i = 0; i < operations.length; i++) {
            const operation = this.operationsStore[operations.charCodeAt(i)];
            if (operation) {
                const args = [];
                for (let j = i+1; j < operations.length; j++) {
                    const value = this.valuesStore[operations.charCodeAt(j)];
                    if (value) {
                        args.push(value);
                    } else {
                        break;
                    }
                }
                operation(...args);
            }
        }
    }

    /**
     * Check whether the value is a valid store object with key-value pairs.
     * 
     * @private
     * @method isValidStoreObject
     * 
     * @param {*} value The value to be checked.
     * @param {string[]} [validKeys] The keys that the object may have. (default: any)
     * @returns {boolean}
     */
    #isValidStoreObject(value, validKeys = []) {
        let hasValidKeys = true;
        if (validKeys.length !== 0) {
            hasValidKeys = Object.keys(value).every(key => validKeys.includes(key));
        }
        return (
            typeof value === 'object'
            && value !== null
            && Array.isArray(value) === false
            && Object.keys(value).length > 0
            && hasValidKeys
            && typeof value.constructor !== 'undefined'
            && value.constructor.prototype.hasOwnProperty('isPrototypeOf') // Object.prototype
        );
    }

    /**
     * Check whether the value is a valid maxOperationsLength number.
     * 
     * @private
     * @method isValidMaxOperationsLength
     * 
     * @param {number} value The value to be checked.
     * @returns {boolean}
     */
    #isValidMaxOperationsLength(value) {
        return (
            typeof value === 'number'
            && value > 0
            && Number.isSafeInteger(value)
        );
    }

    /**
     * Checks the validity of the arguments of the respective method and throws
     * errors if necessary.
     * 
     * @private
     * @method validateArguments
     * 
     * @param {string} method Name of the method
     * @param {Array} args User given arguments to the respective method
     * 
     * @throws {TypeError} If the arguments are of an invalid type:
     *   - 'constructor': If the 'config' parameter is not a valid object with valid keys, or if config's object properties are of an invalid type
     *   - 'storeOperation' and 'storeValue': If the 'symbol' parameter is not a string or an integer
     *   - 'storeOperation': If the 'fn' parameter is not a function
     *   - 'execute': If the 'operation' parameter is not a string
     * 
     * @throws {SyntaxError} If the arguments have syntax errors:
     *   - 'storeOperation' and 'storeValue': If the 'symbol' parameter is a string but not a single character
     * 
     * @throws {RangeError} If the arguments are out of valid range:
     *   - 'storeOperation' and 'storeValue': If the 'symbol' parameter is an integer but out of range
     *   - 'execute': If the 'operation' parameter exceeds the configured 'maxOperationsLength'
     * 
     * @returns {boolean}
     */
    #validateArguments(method, args) {
        switch (method) {
            case 'constructor':
                if (args[0] !== undefined) {
                    if (! this.#isValidStoreObject(args[0], this.#validConfigKeys)) {
                        const validConfigKeysStr = this.#validConfigKeys.slice(0, -1).map(key => `'${key}'`).join(', ');
                        const lastValidConfigKey = this.#validConfigKeys[this.#validConfigKeys.length-1];
                        throw new TypeError(`The 'config' parameter, if defined, must be an object with valid key-value pairs. The valid 'config' properties are ${validConfigKeysStr} and '${lastValidConfigKey}'.`);
                    } else {
                        if (
                            typeof args[0].operationsStore !== 'undefined'
                            && ! this.#isValidStoreObject(args[0].operationsStore)
                        ) {
                            throw new TypeError(`The 'config.operationsStore' property, if defined, must be an object with valid key-value pairs.`);
                        }
                        if (
                            typeof args[0].valuesStore !== 'undefined'
                            && ! this.#isValidStoreObject(args[0].valuesStore)
                        ) {
                            throw new TypeError(`The 'config.valuesStore' property, if defined, must be an object with valid key-value pairs.`);
                        }
                        if (
                            typeof args[0].ignoreWarnings !== 'undefined'
                            && typeof args[0].ignoreWarnings !== 'boolean'
                        ) {
                            throw new TypeError(`The 'config.ignoreWarnings' property, if defined, must be a boolean.`);
                        }
                        if (
                            typeof args[0].maxOperationsLength !== 'undefined'
                            && ! this.#isValidMaxOperationsLength(args[0].maxOperationsLength)
                        ) {
                            throw new TypeError(`The 'config.maxOperationsLength' property, if defined, must be a positive safe integer.`);
                        }
                    }
                }
                break;

            case 'storeOperation':
            case 'storeValue':
                const symbol_isString = typeof args[0] === 'string';
                const symbol_isNumber = typeof args[0] === 'number';
                if (symbol_isString === false && symbol_isNumber === false) {
                    throw new TypeError(`[OpMapper] Unable to ${method} with symbol '${args[0]}'. The symbol must be a string or an integer.`);
                }
                if (symbol_isString && args[0].length !== 1) {
                    throw new SyntaxError(`[OpMapper] Unable to ${method} with symbol '${args[0]}'. A string symbol must consist of a single character.`);
                } else if (symbol_isNumber) {
                    const numbericSymbolMsg = `[OpMapper] Unable to ${method} with symbol '${args[0]}'. A numeric symbol must be an integer within the range of ${this.#minSymbolCode} and ${this.#maxSymbolCode}.`;
                    if (! Number.isInteger(args[0])) {
                        throw new TypeError(numbericSymbolMsg);
                    } else if (
                        args[0] < this.#minSymbolCode
                        || args[0] > this.#maxSymbolCode
                    ) {
                        throw new RangeError(numbericSymbolMsg);
                    }
                }
                if (method === 'storeOperation') {
                    if (typeof args[1] !== 'function') {
                        throw new TypeError(`[OpMapper] Unable to ${method} with symbol '${args[0]}'. The 'fn' parameter must be a function.`);
                    }
                }
                break;

            case 'execute':
                if (typeof args[0] !== 'string') {
                    throw new TypeError(`[OpMapper] Unable to execute the provided operations sequence '${args[0]}'. Each operation must be a string.`);
                }
                if (
                    ! this.ignoreWarnings
                    && this.#maxOperationsLength !== undefined
                    && args[0].length > this.#maxOperationsLength
                ) {
                    throw new RangeError(`[OpMapper] The provided operations sequence exceeds the configured 'maxOperationsLength' of ${this.#maxOperationsLength} characters.`);
                }
                break;
            
            default: break;
        }
    }
}