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
    maxOperationsSequenceLength;
    ignoreWarnings = false;
    strictMode = false;

    #operationsSequence = '';

    #symbolTypeInvalid = 0;
    #symbolTypeInteger = 1;
    #symbolTypeString = 2;

    #minSymbolCharCode = 0;
    #maxSymbolCharCode = 65535;

    #validConfigKeys = [
        'operationsSequence',
        'operationsStore',
        'valuesStore',
        'maxOperationsSequenceLength',
        'ignoreWarnings',
        'strictMode',
    ];

    /**
     * Creates an instance of OpMapper.
     * 
     * @param {Object} [config] Config object to configure OpMapper features.
     * @param {string} [config.operationsSequence] Main operations sequence that should be executed
     *      when `execute` is called without providing the `operationsSequence` parameter. (default: '')
     * @param {Object} [config.operationsStore] Initial object storing operation mappings. (default: {})
     * @param {Object} [config.valuesStore] Initial object storing value mappings. (default: {})
     * @param {number} [config.maxOperationsSequenceLength] Specifies a maximum allowed operations sequence length.
     *      If defined, it must be a positive safe integer. (default: undefined)
     * @param {boolean} [config.ignoreWarnings] Specifies whether warnings should be ignored. (default: false)
     * @param {boolean} [config.strictMode] Specifies the behavior of the library with regard to errors.
     *      If set to `true`, errors will be logged; otherwise, warnings will be logged. Furthermore,
     *      if set to `true` the `maxOperationsSequenceLength` must be adhered to, otherwise the
     *      respective operations sequence will not be executed. (default: false)
     */
    constructor(config) {
        try {
            this.#validateArguments('constructor', arguments);
            if (config !== undefined) {
                if (typeof config.operationsSequence !== 'undefined') {
                    this.#operationsSequence = config.operationsSequence;
                }
                if (typeof config.operationsStore !== 'undefined') {
                    for (const [symbol, callback] of Object.entries(config.operationsStore)) {
                        this.storeOperation(symbol, callback);
                    }
                }
                if (typeof config.valuesStore !== 'undefined') {
                    for (const [symbol, value] of Object.entries(config.valuesStore)) {
                        this.storeValue(symbol, value);
                    }
                }
                if (typeof config.maxOperationsSequenceLength !== 'undefined') {
                    this.maxOperationsSequenceLength = config.maxOperationsSequenceLength;
                }
                if (typeof config.ignoreWarnings === 'boolean') {
                    this.ignoreWarnings = config.ignoreWarnings;
                }
                if (typeof config.strictMode === 'boolean') {
                    this.strictMode = config.strictMode;
                }
            }
        } catch (error) {
            this.#logError(`[OpMapper] ${error.name}: ${error.message}`);
        }
    }

    /**
     * Returns the main operations sequence.
     * 
     * @returns {string}
     */
    getOperationsSequence() {
        return this.#operationsSequence;
    }

    /**
     * Stores an operation mapping.
     * 
     * @method storeOperation
     * 
     * @param {string|number} symbol The character or character code that should be mapped to a function.
     * @param {function} callback The function that the symbol should be mapped to.
     */
    storeOperation(symbol, callback) {
        try {
            this.#validateArguments('storeOperation', arguments);
            const symbolType = this.#getSymbolType(symbol);
            if (symbolType === this.#symbolTypeInteger) {
                this.#operationsStore[symbol] = callback;
            } else if (symbolType === this.#symbolTypeString) {
                this.#operationsStore[symbol.charCodeAt(0)] = callback;
            }
        } catch (error) {
            this.#logError(`[OpMapper] ${error.name}: ${error.message}`);
        }
    }

    /**
     * Stores a value mapping.
     * 
     * @method storeValue
     * 
     * @param {string|number} symbol The character or character code that should be mapped to a value.
     * @param {*} value The value that the symbol should be mapped to.
     */
    storeValue(symbol, value) {
        try {
            this.#validateArguments('storeValue', arguments);
            const symbolType = this.#getSymbolType(symbol);
            if (symbolType === this.#symbolTypeInteger) {
                this.valuesStore[symbol] = value;
            } else if (symbolType === this.#symbolTypeString) {
                this.valuesStore[symbol.charCodeAt(0)] = value;
            }
        } catch (error) {
            this.#logError(`[OpMapper] ${error.name}: ${error.message}`);
        }
    }

    /**
     * Attempts to execute the main operations sequence of the current instance or a provided
     * operations sequence specified by the `operationsSequence` parameter.
     * 
     * @method execute
     * 
     * @param {string} [operationsSequence] The operations sequence to be executed instead of
     *      the main operations sequence of the current instance.
     */
    execute(operationsSequence) {
        try {
            if (operationsSequence === undefined) {
                this.#validateArguments('executeMain', [this.operationsSequence]);
                this.#executeOperationsSequence(this.operationsSequence);
            } else {
                this.#validateArguments('executeProvided', arguments);
                this.#executeOperationsSequence(operationsSequence);
            }
        } catch (error) {
            if (error instanceof TypeError) {
                this.#logError(`[OpMapper] ${error.name}: ${error.message}`);
            } else if (error instanceof RangeError) {
                this.#logError(`[OpMapper] ${error.name}: ${error.message}`);
                if (! strictMode) {
                    if (operationsSequence === undefined) {
                        operationsSequence = this.operationsSequence;
                    }
                    this.#executeOperationsSequence(operationsSequence);
                }
            }
        }
    }

    /**
     * Attempts to execute the provided operations sequence.
     * 
     * @private
     * @method executeOperationsSequence
     * 
     * @param {string} operationsSequence The operations sequence to be executed.
     */
    #executeOperationsSequence(operationsSequence) {
        for (let i = 0; i < operationsSequence.length; i++) {
            const operation = this.#operationsStore[operationsSequence.charCodeAt(i)];
            if (operation) {
                const args = [];
                for (let j = i+1; j < operationsSequence.length; j++) {
                    const value = this.valuesStore[operationsSequence.charCodeAt(j)];
                    if (value) {
                        args.push(value);
                    } else {
                        args.push(undefined);
                    }
                }
                operation(...args);
            }
        }
    }

    /**
     * Checks the type of a symbol and returns the corresponding symbol type.
     * 
     * Returns:
     *  - `0` if the symbol has an invalid type
     *  - `1` if the symbol is an integer
     *  - `2` if the symbol is a string
     * 
     * @private
     * @method checkSymbolTypes
     * 
     * @param {*} value The value for which the symbol type should be determined.
     * @returns {number}
     */
    #getSymbolType(value) {
        const isIntegerSymbol = /^\d+$/.test(value);
        if (isIntegerSymbol) {
            return this.#symbolTypeInteger;
        } else if (! isIntegerSymbol && typeof value === 'string') {
            return this.#symbolTypeString;
        }
        return this.#symbolTypeInvalid;
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
            && ! Array.isArray(value)
            && Object.keys(value).length > 0
            && hasValidKeys
            && typeof value.constructor !== 'undefined'
            && value.constructor.prototype.hasOwnProperty('isPrototypeOf') // Object.prototype
        );
    }

    /**
     * Check whether the value is a valid maxOperationsSequenceLength number.
     * 
     * @private
     * @method isValidMaxOperationsSequenceLength
     * 
     * @param {*} value The value to be checked.
     * @returns {boolean}
     */
    #isValidMaxOperationsSequenceLength(value) {
        return (
            typeof value === 'number'
            && value > 0
            && Number.isSafeInteger(value)
        );
    }

    /**
     * Logs the provided error based on the current `strictMode` configuration.
     * 
     * @param {string} error The error to be logged.
     */
    #logError(error) {
        if (this.strictMode) {
            console.error(error);
        } else {
            if (! this.ignoreWarnings) {
                console.warn(error);
            }
        }
    }

    /**
     * Checks the validity of the arguments of the respective method and throws errors if necessary.
     * 
     * @private
     * @method validateArguments
     * 
     * @param {string} method The method for which the arguments should be checked.
     * @param {Array} args The user provided arguments to the respective method that should be checked.
     * 
     * @throws {TypeError} If the arguments are of an invalid type:
     *      - `constructor`: If the `config` parameter is not a valid object with valid keys, or if
     *              the config object properties are of an invalid type.
     *      - `storeOperation` and `storeValue`: If the `symbol` parameter is not a string or an integer.
     *      - `storeOperation`: If the `callback` parameter is not a function.
     *      - `storeValue`: If the `value` parameter is `undefined`.
     *      - `execute`: If the main operations sequence or the `operationsSequence` parameter is not a string.
     * 
     * @throws {SyntaxError} If the arguments have syntax errors:
     *      - `storeOperation` and `storeValue`: If the `symbol` parameter is a string but not a single character.
     * 
     * @throws {RangeError} If the arguments are out of valid range:
     *      - `storeOperation` and `storeValue`: If the `symbol` parameter is an integer but out of range.
     *      - `execute`: If the main operations sequence or the `operationsSequence` parameter exceeds 
     *              the configured `maxOperationsSequenceLength`.
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
                        throw new TypeError(`The 'config' parameter, if defined, must be a non-empty plain object with valid 'config' properties; these are ${validConfigKeysStr} and '${lastValidConfigKey}'.`);
                    } else {
                        if (
                            typeof args[0].operationsSequence !== 'undefined'
                            && typeof args[0].operationsSequence !== 'string'
                        ) {
                            throw new TypeError(`The 'config.operationsSequence' property, if defined, must be a string.`);
                        }
                        if (
                            typeof args[0].operationsStore !== 'undefined'
                            && ! this.#isValidStoreObject(args[0].operationsStore)
                        ) {
                            throw new TypeError(`The 'config.operationsStore' property, if defined, must be a non-empty plain object.`);
                        }
                        if (
                            typeof args[0].valuesStore !== 'undefined'
                            && ! this.#isValidStoreObject(args[0].valuesStore)
                        ) {
                            throw new TypeError(`The 'config.valuesStore' property, if defined, must be a non-empty plain object`);
                        }
                        if (
                            typeof args[0].maxOperationsSequenceLength !== 'undefined'
                            && ! this.#isValidMaxOperationsSequenceLength(args[0].maxOperationsSequenceLength)
                        ) {
                            throw new TypeError(`The 'config.maxOperationsSequenceLength' property, if defined, must be a positive safe integer.`);
                        }
                        if (
                            typeof args[0].ignoreWarnings !== 'undefined'
                            && typeof args[0].ignoreWarnings !== 'boolean'
                        ) {
                            throw new TypeError(`The 'config.ignoreWarnings' property, if defined, must be a boolean.`);
                        }
                        if (
                            typeof args[0].strictMode !== 'undefined'
                            && typeof args[0].strictMode !== 'boolean'
                        ) {
                            throw new TypeError(`The 'config.strictMode' property, if defined, must be a boolean.`);
                        }
                    }
                }
                break;

            case 'storeOperation':
            case 'storeValue':
                const symbolType = this.#getSymbolType(args[0]);
                if (symbolType === this.#symbolTypeInvalid) {
                    throw new TypeError(`Unable to ${method} with symbol '${args[0]}'. The symbol must be a string or an integer.`);
                }
                if (
                    symbolType === this.#symbolTypeString
                    && args[0].length !== 1
                ) {
                    throw new SyntaxError(`Unable to ${method} with symbol '${args[0]}'. A string symbol must consist of a single character.`);
                } else if (
                    symbolType === this.#symbolTypeInteger
                    && (
                        args[0] < this.#minSymbolCharCode
                        || args[0] > this.#maxSymbolCharCode
                    )
                ) {
                    throw new RangeError(`Unable to ${method} with symbol '${args[0]}'. An integer symbol must be within the range of ${this.#minSymbolCharCode} and ${this.#maxSymbolCharCode}.`);
                }
                if (method === 'storeOperation') {
                    if (typeof args[1] !== 'function') {
                        throw new TypeError(`Unable to ${method} with symbol '${args[0]}'. The 'callback' parameter must be a function.`);
                    }
                } else if (method === 'storeValue') {
                    if (typeof args[1] === 'undefined') {
                        throw new TypeError(`Unable to ${method} with symbol '${args[0]}'. The 'value' parameter cannot be undefined.`);
                    }
                }
                break;

            case 'executeMain':
            case 'executeProvided':
                const operationsSequenceType = method.substring(7).toLowerCase();
                method = 'execute';
                if (
                    typeof args[0] !== 'undefined'
                    && typeof args[0] !== 'string'
                ) {
                    throw new TypeError(`Unable to ${method} the ${operationsSequenceType} operations sequence '${args[0]}'. An operations sequence must be a string.`);
                }
                if (
                    typeof args[0] === 'string'
                    && this.maxOperationsSequenceLength !== undefined
                    && args[0].length > this.maxOperationsSequenceLength
                ) {
                    throw new RangeError(`Unable to ${method} the ${operationsSequenceType} operations sequence '${args[0]}'. The ${operationsSequenceType} operations sequence exceeds the configured 'maxOperationsSequenceLength' of ${this.maxOperationsSequenceLength} characters.`);
                }
                break;
            
            default: break;
        }
    }
}