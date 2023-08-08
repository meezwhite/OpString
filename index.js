/**!
 * OpString
 * 
 * @version 0.3.1
 * @license MIT
 * @copyright meezwhite
 */
export default class OpString {
    version = '0.3.1';

    #sequence = '';
    #sequenceData = [];
    #operations = {};
    #values = {};
    #labels = {};
    #maxSequenceLength;
    #ignoreWarnings = false;
    #strictMode = false;

    #nextOperationId = 1;

    #symbolTypeInvalid = 0;
    #symbolTypeString = 1;
    #symbolTypeInteger = 2;

    #minCharCode = 0;
    #maxCharCode = 65535;

    #validConfigKeys = [
        'sequence',
        'operations',
        'values',
        'labels',
        'maxSequenceLength',
        'ignoreWarnings',
        'strictMode',
    ];

    /**
     * Creates an instance of OpString.
     * 
     * @constructor
     * 
     * @param {Object} [config] - Config object to configure OpString features.
     * @param {string} [config.sequence] - The character sequence to be executed when `execute` is
     *      called without providing a `sequence` parameter. (default: '')
     * @param {Object} [config.operations] - Object containing the operation mappings to be
     *      registered. (default: {})
     * @param {Object} [config.values] - Object containing the value mappings to be
     *      registered. (default: {})
     * @param {Object} [config.labels] - Object containing the label mappings to be
     *      registered. (default: {})
     * @param {number} [config.maxSequenceLength] - Specifies a maximum allowed sequence length.
     *      If defined, it must be a positive safe integer. (default: undefined)
     * @param {boolean} [config.ignoreWarnings] - Specifies whether warnings should be ignored.
     *      (default: false)
     * @param {boolean} [config.strictMode] - Specifies the behavior of the OpString with regard to
     *      errors. If set to `true`, errors will be logged; otherwise, warnings will be logged.
     *      Furthermore, if set to `true` the `maxSequenceLength` must strictly be adhered to,
     *      otherwise, the respective character sequence will not be set/executed. (default: false)
     */
    constructor(config) {
        try {
            this.#validateArguments('constructor', arguments);
            if (config !== undefined) {
                if (typeof config.maxSequenceLength !== 'undefined') {
                    this.#maxSequenceLength = config.maxSequenceLength;
                }
                if (typeof config.ignoreWarnings === 'boolean') {
                    this.#ignoreWarnings = config.ignoreWarnings;
                }
                if (typeof config.strictMode === 'boolean') {
                    this.#strictMode = config.strictMode;
                }
                if (typeof config.operations !== 'undefined') {
                    this.#registerOperationsInternal(config.operations);
                }
                if (typeof config.values !== 'undefined') {
                    this.#registerValuesInternal(config.values);
                }
                if (typeof config.labels !== 'undefined') {
                    this.#registerLabelsInternal(config.labels);
                }
                if (typeof config.sequence !== 'undefined') {
                    this.setSequence(config.sequence);
                }
            }
        } catch (error) {
            this.#logError(error);
        }
    }

    /**
     * Appends an operation to the sequence and returns the id of the appended operation.
     * 
     * @method append
     * 
     * @param {string|number} operation - The character or character code of the operation to be
     *      appended.
     * @param {Array<string|number>} [values] - An array with the characters or character codes
     *      of the values corresponding to the operation to be appended.
     * @returns {number|boolean} - The id of the appended operation or `false` if the operation
     *      wasn't appended.
     */
    append(operation, values) {
        const operationId = this.#nextOperationId;
        try {
            this.#validateArguments('append', arguments);
            this.#sequenceData.push({
                id: operationId,
                operation: this.#computeCharCode(operation),
                values: this.#computeCharCodes(values),
            });
            this.#nextOperationId++;
            this.#computeSequence();
            return operationId;
        } catch (error) {
            this.#logError(error);
        }
        return false;
    }

    /**
     * Inserts an operation to the sequence at the specified index and returns the id of the
     * inserted operation.
     * 
     * @method insert
     * 
     * @param {number} index - The index at which the operation should be added.
     * @param {string|number} operation - The character or character code of the operation to be
     *      inserted.
     * @param {Array<string|number>} [values] - An array with the characters or character codes of
     *      the values corresponding to the operation to be inserted.
     * @returns {number|boolean} - The id of the inserted operation or `false` if the operation
     *      wasn't inserted.
     */
    insert(index, operation, values) {
        const operationId = this.#nextOperationId;
        try {
            this.#validateArguments('add', arguments);
            this.#sequenceData.splice(index, 0, {
                id: operationId,
                operation: this.#computeCharCode(operation),
                values: this.#computeCharCodes(values),
            });
            this.#nextOperationId++;
            this.#computeSequence();
            return operationId;
        } catch (error) {
            this.#logError(error);
        }
        return false;
    }

    /**
     * Prepends an operation to the sequence and returns its id.
     * 
     * @method prepend
     * 
     * @param {string|number} operation - The character or character code of the operation to be
     *      prepended.
     * @param {Array<string|number>} [values] - An array with the characters or character codes of
     *      the values corresponding to the operation to be prepended.
     * @returns {number|boolean} - The id of the prepended operation or `false` if the operation
     *      wasn't prepended.
     */
    prepend(operation, values) {
        const operationId = this.#nextOperationId;
        try {
            this.#validateArguments('prepend', arguments);
            this.#sequenceData.unshift({
                id: operationId,
                operation: this.#computeCharCode(operation),
                values: this.#computeCharCodes(values),
            });
            this.#nextOperationId++;
            this.#computeSequence();
            return operationId;
        } catch (error) {
            this.#logError(error);
        }
        return false;
    }

    /**
     * Removes the operation with the specified id from the sequence.
     * 
     * @method remove
     * 
     * @param {number} id - The id of the operation that should be removed.
     * 
     * @throws {ReferenceError} - If there is no operation with the specified id.
     * 
     * @returns {boolean} - If the respective operation was removed `true`, otherwise `false`.
     */
    remove(id) {
        try {
            this.#validateArguments('remove', arguments);
            const index = this.#sequenceData.findIndex(operation => operation.id === id);
            if (index !== -1) {
                this.#sequenceData.splice(index, 1);
                this.#computeSequence();
            } else {
                throw new ReferenceError(`Cannot remove operation with id ${id}, since not found.`);
            }
        } catch (error) {
            this.#logError(error);
            return false;
        }
        return true;
    }

    /**
     * Returns the index of the operation with the provided id in the sequence.
     * 
     * @param {number} id - The id of the operation in the sequence for which the index should be returned.
     * 
     * @throws {ReferenceError} - If there is no operation with the specified id.
     * 
     * @returns {number|undefined} - Index of the operation in the sequence, or `undefined` if not found.
     */
    index(id) {
        try {
            this.#validateArguments('index', arguments);
            const index = this.#sequenceData.findIndex(operation => operation.id === id);
            if (index !== -1) {
                return index;
            } else {
                throw new ReferenceError(`Cannot find index of operation with id ${id}, since not found.`);
            }
        } catch (error) {
            this.#logError(error);
        }
        return undefined;
    }

    /**
     * Computes the character code of the provided value.
     * 
     * @private
     * @method computeCharCode
     * 
     * @param {*} value - The value for which the character code should be computed.
     * @returns {*} - If the provided value is a string, the character code of the first position
     *      of the string is computed; otherwise, the provided value is returned back.
     */
    #computeCharCode(value) {
        if (this.#getSymbolType(value) === this.#symbolTypeString) {
            return value.charCodeAt(0);
        }
        return value;
    }

    /**
     * Computes an array of character codes given the provided values.
     *
     * @private
     * @method computeCharCodes
     * 
     * @param {Array<*>} values - The array of values for which character codes should be computed.
     * @returns {Array<number|null>} - An array of character codes. If a character code cannot be
     *      computed, `null` will be used instead.
     */
    #computeCharCodes(values) {
        if (values !== undefined) {
            return values.map((value) => {
                const symbolType = this.#getSymbolType(value);
                if (symbolType === this.#symbolTypeString) {
                    return value.charCodeAt(0);
                } else if (symbolType === this.#symbolTypeInteger) {
                    return value;
                }
                return null;
            });
        }
        return [];
    }

    /**
     * Computes the character sequence from the sequence data array.
     */
    #computeSequence() {
        let sequence = '';
        for (let i = 0; i < this.#sequenceData.length; i++) {
            sequence += String.fromCharCode(this.#sequenceData[i].operation);
            for (let j = 0; j < this.#sequenceData[i].values.length; j++) {
                sequence += String.fromCharCode(this.#sequenceData[i].values[j]);
            }
        }
        this.#sequence = sequence;
    }

    /**
     * Sets the character sequence.
     * 
     * @method setSequence
     * 
     * @param {string} sequence - The character sequence that should be set.
     */
    setSequence(sequence) {
        let caughtError = false;
        try {
            this.#validateArguments('setSequence', arguments);
        } catch (error) {
            caughtError = true;
            this.#logError(error);
        } finally {
            if (! caughtError || (caughtError && ! this.#strictMode)) {
                this.#sequence = sequence;
                this.#sequenceData = [];
                for (let i = 0; i < sequence.length; i++) {
                    const operationCharCode = sequence.charCodeAt(i);
                    const operation = this.#operations[operationCharCode];
                    if (operation) {
                        const args = [];
                        for (let j = i+1; j < sequence.length; j++) {
                            const valueCharCode = sequence.charCodeAt(j);
                            const value = this.#values[valueCharCode];
                            if (value) {
                                args.push(valueCharCode);
                            } else {
                                if (this.#operations[valueCharCode]) {
                                    break;
                                } else {
                                    /**
                                     * NOTE: Register unknown value symbols with a value of `null`.
                                     * Enables handling of unknown value symbols appropriately.
                                     */
                                    this.registerValue(valueCharCode, null);
                                    args.push(valueCharCode);
                                }
                            }
                        }
                        this.#sequenceData.push({
                            id: this.#nextOperationId++,
                            operation: operationCharCode,
                            values: args,
                        });
                    }
                }
            }
        }
    }

    /**
     * Returns the character sequence.
     * 
     * @method getSequence
     * 
     * @returns {string} - The character sequence
     */
    getSequence() {
        return this.#sequence;
    }

    /**
     * Returns the sequence data array.
     * 
     * @method getSequenceData
     * 
     * @return {Array<Object>} - The sequence data array
     */
    getSequenceData() {
        return this.#sequenceData;
    }

    /**
     * Registers an operation mapping.
     * 
     * @method registerOperation
     * 
     * @param {string|number} symbol - The character or character code to be mapped to a function.
     * @param {function} callback - The function to which the symbol should be mapped to.
     */
    registerOperation(symbol, callback) {
        try {
            this.#validateArguments('registerOperation', arguments);
            const symbolType = this.#getSymbolType(symbol);
            if (symbolType === this.#symbolTypeString) {
                this.#operations[symbol.charCodeAt(0)] = callback;
            } else if (symbolType === this.#symbolTypeInteger) {
                this.#operations[symbol] = callback;
            }
        } catch (error) {
            this.#logError(error);
        }
    }

    /**
     * Registers additional operation mappings provided by the `operations` object.
     * 
     * @method registerOperations
     * 
     * @param {Object} operations - Object containing additional operation mappings to be
     *      registered.
     */
    registerOperations(operations) {
        try {
            this.#validateArguments('registerOperations', arguments);
            this.#registerOperationsInternal(operations);
        } catch (error) {
            this.#logError(error);
        }
    }

    /**
     * Registers additional operation mappings provided by the `operations` object without 
     * re-validating the `operations` object.
     * 
     * @private
     * @method registerOperations
     * 
     * @param {Object} operations - Object containing the operation mappings to be registered.
     */
    #registerOperationsInternal(operations) {
        for (const [symbol, callback] of Object.entries(operations)) {
            this.registerOperation(symbol, callback);
        }
    }

    /**
     * Registers the operation mappings provided by the `operations` object. Previously registered
     * operation mappings will be deleted.
     * 
     * @method setOperations
     * 
     * @param {Object} operations - Object containing new operation mappings to be registered.
     */
    setOperations(operations) {
        try {
            this.#validateArguments('setOperations', arguments);
            this.#operations = {};
            this.#registerOperationsInternal(operations);
        } catch (error) {
            this.#logError(error);
        }
    }

    /**
     * Returns the registered operations.
     * 
     * @method getOperations
     * 
     * @returns {Object} - The registered operations
     */
    getOperations() {
        return this.#operations;
    }

    /**
     * Registers a value mapping.
     * 
     * @method registerValue
     * 
     * @param {string|number} symbol - The character or character code to be mapped to a value.
     * @param {*} value - The value to which the symbol should be mapped to.
     */
    registerValue(symbol, value) {
        try {
            this.#validateArguments('registerValue', arguments);
            const symbolType = this.#getSymbolType(symbol);
            if (symbolType === this.#symbolTypeString) {
                this.#values[symbol.charCodeAt(0)] = value;
            } else if (symbolType === this.#symbolTypeInteger) {
                this.#values[symbol] = value;
            }
        } catch (error) {
            this.#logError(error);
        }
    }

    /**
     * Registers additional value mappings provided by the `values` object.
     * 
     * @method registerValues
     * 
     * @param {Object} values - Object containing additional value mappings to be registered.
     */
    registerValues(values) {
        try {
            this.#validateArguments('registerValues', arguments);
            this.#registerValuesInternal(values);
        } catch (error) {
            this.#logError(error);
        }
    }

    /**
     * Registers additional value mappings provided by the `values` object without re-validating
     * the `values` object.
     * 
     * @private
     * @method registerValues
     * 
     * @param {Object} values - Object containing the value mappings to be registered.
     */
    #registerValuesInternal(values) {
        for (const [symbol, callback] of Object.entries(values)) {
            this.registerValue(symbol, callback);
        }
    }

    /**
     * Registers the value mappings provided by the `values` object. Previously registered
     * value mappings will be deleted.
     * 
     * @method setValues
     * 
     * @param {Object} values - Object containing new values mappings to be registered.
     */
    setValues(values) {
        try {
            this.#validateArguments('setValues', arguments);
            this.#values = {};
            this.#registerValuesInternal(values);
        } catch (error) {
            this.#logError(error);
        }
    }

    /**
     * Returns the registered values.
     * 
     * @method getValues
     * 
     * @returns {Object} - The registered values
     */
    getValues() {
        return this.#values;
    }

    /**
     * Returns the corresponding character for the provided value, if the value is registered.
     * 
     * @param {*} value - The value for which a coresponding character should be returned.
     * @returns {string|undefined} - If the value is registered, the corresponding character
     *      is returned; otherwise `undefined`.
     */
    getCharForValue(value) {
        try {
            this.#validateArguments('getCharForValue', arguments);
            const charCode = this.getCharCodeForValue(value);
            if (charCode !== undefined) {
                return String.fromCharCode(charCode);
            }
        } catch (error) {
            this.#logError(error);
        }
        return undefined;
    }

    /**
     * Returns the corresponding character code for the provided value, if the value is registered.
     * 
     * @param {*} value - The value for which a coresponding character code should be returned.
     * @returns {number|undefined} - If the value is registered, the corresponding character code
     *      is returned; otherwise `undefined`.
     */
    getCharCodeForValue(value) {
        try {
            this.#validateArguments('getCharCodeForValue', arguments);
            const keys = Object.keys(this.#values);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (this.#values[key] === value) {
                    return key;
                }
            }
        } catch (error) {
            this.#logError(error);
        }
        return undefined;
    }

    /**
     * Registers a label mapping to represent the provided symbol.
     * 
     * @method registerLabel
     * 
     * @param {string} label - The label to represent the provided symbol.
     * @param {string|number} symbol - The character or character code to be mapped to the label.
     */
    registerLabel(label, symbol) {
        try {
            this.#validateArguments('registerLabel', arguments);
            const symbolType = this.#getSymbolType(symbol);
            if (symbolType === this.#symbolTypeString) {
                this.#labels[label] = symbol.charCodeAt(0);
            } else if (symbolType === this.#symbolTypeInteger) {
                this.#labels[label] = symbol;
            }
        } catch (error) {
            this.#logError(error);
        }
    }

    /**
     * Registers additional label mappings provided by the `labels` object.
     * 
     * @method registerLabels
     * 
     * @param {Object} labels - Object containing additional label mappings to be registered.
     */
    registerLabels(labels) {
        try {
            this.#validateArguments('registerLabels', arguments);
            this.#registerLabelsInternal(labels);
        } catch (error) {
            this.#logError(error);
        }
    }

    /**
     * Registers additional label mappings provided by the `labels` object without re-validating
     * the `labels` object.
     * 
     * @private
     * @method registerLabels
     * 
     * @param {Object} labels - Object containing the label mappings to be registered.
     */
    #registerLabelsInternal(labels) {
        for (const [label, symbol] of Object.entries(labels)) {
            this.registerLabel(label, symbol);
        }
    }

    /**
     * Registers the label mappings provided by the `labels` object. Previously registered
     * label mappings will be deleted.
     * 
     * @method setLabels
     * 
     * @param {Object} labels - Object containing new labels mappings to be registered.
     */
    setLabels(labels) {
        try {
            this.#validateArguments('setLabels', arguments);
            this.#labels = {};
            this.#registerLabelsInternal(labels);
        } catch (error) {
            this.#logError(error);
        }
    }

    /**
     * Returns the registered labels.
     * 
     * @method getLabels
     * 
     * @returns {Object} - The registered labels
     */
    getLabels() {
        return this.#labels;
    }

    /**
     * Returns the corresponding character for the provided label, if the label is registered.
     * 
     * @param {string} label - The label for which a coresponding character should be returned.
     * @returns {string|undefined} - If the label is registered, the corresponding character
     *      is returned; otherwise `undefined`.
     */
    getCharForLabel(label) {
        try {
            this.#validateArguments('getCharForLabel', arguments);
            const charCode = this.getCharCodeForLabel(label);
            if (charCode !== undefined) {
                return String.fromCharCode(charCode);
            }
        } catch (error) {
            this.#logError(error);
        }
        return undefined;
    }

    /**
     * Returns the corresponding character code for the provided label, if the label is registered.
     * 
     * @param {string} label - The label for which a coresponding character code should be returned.
     * @returns {number|undefined} - If the label is registered, the corresponding character code
     *      is returned; otherwise `undefined`.
     */
    getCharCodeForLabel(label) {
        try {
            this.#validateArguments('getCharCodeForLabel', arguments);
            if (this.#labels[label] !== undefined) {
                return this.#labels[label];
            }
        } catch (error) {
            this.#logError(error);
        }
        return undefined;
    }

    /**
     * Sets the maximum allowed sequence limit.
     * 
     * @method setMaxSequenceLength
     * 
     * @param {number} maxSequenceLength - The maximum allowed sequence length
     */
    setMaxSequenceLength(maxSequenceLength) {
        try {
            this.#validateArguments('setMaxSequenceLength', arguments);
            this.#maxSequenceLength = maxSequenceLength;
        } catch (error) {
            this.#logError(error);
        }
    }

    /**
     * Returns the `maxSequenceLength` value. If the `maxSequenceLength` has not been
     * configured, `undefined` is returned.
     * 
     * @method getMaxSequenceLength
     * 
     * @returns {number|undefined} - The configured `maxSequenceLength` value, or `undefined` if
     *      not configured.
     */
    getMaxSequenceLength() {
        return this.#maxSequenceLength;
    }

    /**
     * Attempts to execute the character sequence of the current instance or a provided
     * character sequence specified by the `sequence` parameter.
     * 
     * @method execute
     * 
     * @param {string} [sequence] - The character sequence to be executed instead of
     *      the character sequence of the current instance.
     */
    execute(sequence) {
        const sequence_isUndefined = sequence === undefined;
        let caughtError = false;
        try {
            if (sequence_isUndefined) {
                this.#validateArguments('executeMain', [this.#sequence]);
            } else {
                this.#validateArguments('executeProvided', arguments);
            }
        } catch (error) {
            caughtError = true;
            this.#logError(error);
        } finally {
            if (! caughtError || (caughtError && ! this.#strictMode)) {
                if (sequence_isUndefined) {
                    this.#executeSequenceFromData();
                } else {
                    this.#executeSequence(sequence);
                }
            }
        }
    }

    /**
     * Attempts to execute the provided character sequence.
     * 
     * @private
     * @method executeSequence
     * 
     * @param {string} sequence - The character sequence to be executed.
     */
    #executeSequence(sequence) {
        if (typeof sequence !== 'string') {
            sequence = '';
        }
        for (let i = 0; i < sequence.length; i++) {
            const operation = this.#operations[sequence.charCodeAt(i)];
            if (operation) {
                const args = [];
                for (let j = i+1; j < sequence.length; j++) {
                    const valueCharCode = sequence.charCodeAt(j);
                    const value = this.#values[valueCharCode];
                    if (value !== undefined) {
                        args.push(value);
                    } else {
                        if (this.#operations[valueCharCode]) {
                            break;
                        } else {
                            args.push(undefined);
                        }
                    }
                }
                operation(...args);
            }
        }
    }

    /**
     * Attempts to execute the provided character sequence from the sequence data array.
     * 
     * @private
     * @method executeSequenceFromData
     */
    #executeSequenceFromData() {
        for (let i = 0; i < this.#sequenceData.length; i++) {
            const operationCharCode = this.#sequenceData[i].operation;
            const operation = this.#operations[operationCharCode];
            if (operation) {
                const args = [];
                for (let j = 0; j < this.#sequenceData[i].values.length; j++) {
                    const valueCharCode = this.#sequenceData[i].values[j];
                    const value = this.#values[valueCharCode];
                    if (value !== undefined) {
                        args.push(value);
                    } else {
                        if (this.#operations[valueCharCode]) {
                            break;
                        } else {
                            args.push(undefined);
                        }
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
     * @method getSymbolType
     * 
     * @param {*} value - The value for which the symbol type should be determined.
     * @returns {number}
     */
    #getSymbolType(value) {
        const value_isInteger = /^\d+$/.test(value);
        if (value_isInteger) {
            return this.#symbolTypeInteger;
        } else if (! value_isInteger && typeof value === 'string') {
            return this.#symbolTypeString;
        }
        return this.#symbolTypeInvalid;
    }

    /**
     * Checks whether the value is a valid store object with key-value pairs.
     * 
     * @private
     * @method isValidStoreObject
     * 
     * @param {*} value - The value to be checked.
     * @param {Array<string>} [validKeys] - The keys that the object may have. (default: [])
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
     * Checks whether the value is within the allowed character code range.
     * 
     * @private
     * @method isCharCodeWithinRange
     * 
     * @param {number} value - The value to be checked.
     * @returns {boolean}
     */
    #isCharCodeWithinRange(value) {
        return value >= this.#minCharCode && value <= this.#maxCharCode;
    }

    /**
     * Check whether the value is a positive save integer.
     * 
     * @private
     * @method isPositiveSafeInteger
     * 
     * @param {*} value - The value to be checked.
     * @returns {boolean}
     */
    #isPositiveSafeInteger(value) {
        return (
            typeof value === 'number'
            && Number.isSafeInteger(value)
            && value > 0
        );
    }

    /**
     * Checks whether the provided character sequence is within the configured `maxSequenceLength`
     * limit. If `maxSequenceLength` has not been configured, return `true`.
     * 
     * @private
     * @method isSequenceLengthWithinLimit
     * 
     * @param {string} sequence - The character sequence to be checked.
     * @returns {boolean}
     */
    #isSequenceLengthWithinLimit(sequence) {
        if (
            this.#maxSequenceLength !== undefined
            && sequence.length > this.#maxSequenceLength
        ) {
            return false;
        }
        return true;
    }

    /**
     * Logs the provided error based on the current `strictMode` configuration.
     * 
     * @param {TypeError|SyntaxError|RangeError|ReferenceError} error - The error to be logged.
     */
    #logError(error) {
        error = `[${this.constructor.name}] ${error.name}: ${error.message}`;
        if (this.#strictMode) {
            console.error(error);
        } else {
            if (! this.#ignoreWarnings) {
                console.warn(error);
            }
        }
        // console.trace();
    }

    /**
     * Checks the validity of the arguments of the respective method and throws errors if necessary.
     * 
     * @private
     * @method validateArguments
     * 
     * @param {string} method - The method for which the arguments should be checked.
     * @param {Array<*>} args - The user provided arguments to the respective method to be checked.
     * 
     * @throws {TypeError} - If the arguments are of an invalid type:
     *      - `constructor`: If the `config` parameter is empty, not a plain object or doesn't have valid keys, or if the config object properties are of an invalid type.
     *      - `insert`: If the `index` parameter is not a non-negative integer.
     *      - `append`, `insert` and `prepend`: If the `values` parameter is not an array or an empty array.
     *      - `remove`, `index`: If the `id` parameter is not a positive safe integer.
     *      - `append`, `insert`, `prepend`, `registerOperation`, `registerValue` and `registerLabel`: If the `symbol` parameter is not a string or an integer.
     *      - `registerOperation`: If the `callback` parameter is not a function.
     *      - `setOperations`and `registerOperations`: If the `operations` parameter is empty or not a plain object.
     *      - `registerValue`: If the `value` parameter is `undefined`.
     *      - `setValues` and `registerValues`: If the `values` parameter is empty or not a plain object.
     *      - `registerLabel`: If the `label` parameter is not a string.
     *      - `setLabels` and `registerLabels`: If the `labels` parameter is empty or not a plain object.
     *      - `getCharForValue` and `getCharCodeForValue`: If the `value` parameter is `undefined`.
     *      - `getCharForLabel` and `getCharCodeForLabel`: If the `label` parameter is `undefined`.
     *      - `setMaxSequenceLength`: If the `maxSequenceLength` parameter is not a positive safe integer.
     *      - `execute`: If the character sequence of the current instance or the `sequence` parameter is not a string.
     * 
     * @throws {SyntaxError} - If the arguments have syntax errors:
     *      - `append`, `insert` and `prepend`: If the `values` parameter contains invalid symbols.
     *      - `append`, `insert`, `prepend`, `registerOperation`, `registerValue` and `registerLabel`: If the `symbol` parameter is a string but not a single character.
     *      - `execute`: If the sequence to be executed is empty.
     * 
     * @throws {RangeError} - If the arguments are out of valid range:
     *      - `append`, `insert`, `prepend`, `registerOperation`, `registerValue` and `registerLabel`: If the `symbol` parameter is an integer but out of range.
     *      - `execute`: If the character sequence of the current instance or the `sequence` parameter exceeds the configured `maxSequenceLength`.
     */
    #validateArguments(method, args) {
        let introMsg;
        switch (method) {
            case 'constructor':
                if (args[0] !== undefined) {
                    if (! this.#isValidStoreObject(args[0], this.#validConfigKeys)) {
                        const validConfigKeysStr = this.#validConfigKeys.slice(0, -1).map(key => `'${key}'`).join(', ');
                        const lastValidConfigKey = this.#validConfigKeys[this.#validConfigKeys.length-1];
                        throw new TypeError(`The 'config' parameter, if defined, must be a non-empty plain object with valid 'config' properties; these are ${validConfigKeysStr} and '${lastValidConfigKey}'.`);
                    } else {
                        if (
                            typeof args[0].sequence !== 'undefined'
                            && typeof args[0].sequence !== 'string'
                        ) {
                            throw new TypeError(`The 'config.sequence' property, if defined, must be a string.`);
                        }
                        if (
                            typeof args[0].operations !== 'undefined'
                            && ! this.#isValidStoreObject(args[0].operations)
                        ) {
                            throw new TypeError(`The 'config.operations' property, if defined, must be a non-empty plain object.`);
                        }
                        if (
                            typeof args[0].values !== 'undefined'
                            && ! this.#isValidStoreObject(args[0].values)
                        ) {
                            throw new TypeError(`The 'config.values' property, if defined, must be a non-empty plain object`);
                        }
                        if (
                            typeof args[0].labels !== 'undefined'
                            && ! this.#isValidStoreObject(args[0].labels)
                        ) {
                            throw new TypeError(`The 'config.labels' property, if defined, must be a non-empty plain object`);
                        }
                        if (
                            typeof args[0].maxSequenceLength !== 'undefined'
                            && ! this.#isPositiveSafeInteger(args[0].maxSequenceLength)
                        ) {
                            throw new TypeError(`The 'config.maxSequenceLength' property, if defined, must be a positive safe integer.`);
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

            case 'setSequence':
                if (this.#strictMode) {
                    introMsg = `Cannot ${method} to '${args[0]}'. The`;
                } else {
                    introMsg = `Setting the sequence to '${args[0]}' despite exceeded length. The`;
                }
                if (
                    typeof args[0] !== 'undefined'
                    && typeof args[0] !== 'string'
                ) {
                    throw new TypeError(`${introMsg} sequence must be a string.`);
                }
                if (
                    typeof args[0] === 'string'
                    && ! this.#isSequenceLengthWithinLimit(args[0])
                ) {
                    throw new RangeError(`${introMsg} provided sequence exceeds the configured 'maxSequenceLength' of ${this.#maxSequenceLength} characters.`);
                }
                break;

            case 'remove':
                if (! this.#isPositiveSafeInteger(args[0])) {
                    throw new TypeError(`Cannot remove operation with id '${args[0]}'. The id must be a positive safe integer.`);
                }
                break;

            case 'index':
                if (! this.#isPositiveSafeInteger(args[0])) {
                    throw new TypeError(`Cannot find index for operation with id '${args[0]}'. The id must be a positive safe integer.`);
                }
                break;

            case 'append':
            case 'insert':
            case 'prepend':
            case 'registerOperation':
            case 'registerValue':
            case 'registerLabel':
                /**
                 * NOTE: For the 'insert' method, change the arguments order for easier validation.
                 * The new order of the arguments will be: operation, values, index.
                 */
                if (method === 'insert') {
                    args = [args[1], args[2], args[0]];
                } else if (method === 'registerLabel') {
                    args = [args[1], args[0]];
                }
                const method_isOpSeqAction = ['append', 'insert', 'prepend'].includes(method);
                const afterMethodString = method_isOpSeqAction ? ' operation' : '';
                introMsg = `Cannot ${method}${afterMethodString} with symbol '${args[0]}'`;
                /**
                 * NOTE: Validate the first argument of the 'insert' and 'registerLabel' methods,
                 * because from a developer's perspective, it is considered the first argument,
                 * and if it is invalid, it should be the first to throw an error.
                 */
                if (method === 'insert') {
                    const index_isNumber = typeof args[2] === 'number';
                    if (! index_isNumber || (index_isNumber && args[2] < 0)) {
                        throw new TypeError(`${introMsg} at index '${args[2]}'. The index must be a non-negative integer.`);
                    }
                } else if (method === 'registerLabel') {
                    if (typeof args[0] !== 'string') {
                        throw new TypeError(`${introMsg}. The label must be a string.`);
                    }
                }
                const stringOrIntegerSymbolMsg = 'symbol must be a string or an integer.';
                const singleCharacterSymbolMsg = 'string symbol must consist of a single character.';
                const symbolRangeMsg = `integer symbol must be within the range of ${this.#minCharCode} and ${this.#maxCharCode}.`;
                const symbolType = this.#getSymbolType(args[0]);
                if (symbolType === this.#symbolTypeInvalid) {
                    throw new TypeError(`${introMsg}. The ${stringOrIntegerSymbolMsg}`);
                }
                if (symbolType === this.#symbolTypeString && args[0].length !== 1) {
                    throw new SyntaxError(`${introMsg}. A ${singleCharacterSymbolMsg}`);
                } else if (
                    symbolType === this.#symbolTypeInteger
                    && ! this.#isCharCodeWithinRange(args[0])
                ) {
                    throw new RangeError(`${introMsg}. An ${symbolRangeMsg}`);
                }
                if (method_isOpSeqAction) {
                    if (args[1] !== undefined) {
                        const values_isArray = Array.isArray(args[1]);
                        if (! values_isArray || (values_isArray && args[1].length === 0)) {
                            throw new TypeError(`${introMsg}. The 'values' parameter must be an non-empty array.`);
                        }
                        const afterIntroMsg = ` and values '${args[1]}'. The 'values' array contains an invalid symbol. Each `;
                        for (let i = 0; i < args[1].length; i++) {
                            const symbolType = this.#getSymbolType(args[1][i]);
                            if (symbolType === this.#symbolTypeInvalid) {
                                throw new TypeError(`${introMsg}${afterIntroMsg}${stringOrIntegerSymbolMsg}`);
                            }
                            if (
                                symbolType === this.#symbolTypeString
                                && args[1][i].length !== 1
                            ) {
                                throw new SyntaxError(`${introMsg}${afterIntroMsg}${singleCharacterSymbolMsg}`);
                            } else if (
                                symbolType === this.#symbolTypeInteger
                                && ! this.#isCharCodeWithinRange(args[1][i])
                            ) {
                                throw new RangeError(`${introMsg}${afterIntroMsg}${symbolRangeMsg}`);
                            }
                        }
                    }
                }
                if (method === 'registerOperation') {
                    if (typeof args[1] !== 'function') {
                        throw new TypeError(`${introMsg}. The 'callback' parameter must be a function.`);
                    }
                } else if (method === 'registerValue') {
                    if (typeof args[1] === 'undefined') {
                        throw new TypeError(`${introMsg}. The 'value' parameter cannot be undefined.`);
                    }
                }
                break;

            case 'setOperations':
            case 'registerOperations':
            case 'setValues':
            case 'registerValues':
            case 'registerLabels':
                let registerParamName;
                if (['setOperations', 'registerOperations'].includes(method)) {
                    registerParamName = 'operations';
                } else if (['setValues', 'registerValues'].includes(method)) {
                    registerParamName = 'values';
                } else if (['setLabels', 'registerLabels'].includes(method)) {
                    registerParamName = 'labels';
                }
                if (! this.#isValidStoreObject(args[0])) {
                    throw new TypeError(`Cannot ${method}, since the '${registerParamName}' parameter must be a non-empty plain object.`);
                }
                break;

            case 'getCharForValue':
            case 'getCharCodeForValue':
            case 'getCharForLabel':
            case 'getCharCodeForLabel':
                const suffix = method.slice(-5);
                if (args[0] === undefined) {
                    throw new TypeError(`Cannot get character${method === `getCharFor${suffix}` ? '' : ' code'} for undefined ${suffix.toLowerCase()}.`);
                }
                break;

            case 'setMaxSequenceLength':
                if (! this.#isPositiveSafeInteger(args[0])) {
                    throw new TypeError(`Cannot ${method}, since the 'maxSequenceLength' parameter must be a positive safe integer.`);
                }
                break;

            case 'executeMain':
            case 'executeProvided':
                const sequenceType = method === 'executeProvided' ? 'provided' : '';
                method = 'execute';
                if (this.#strictMode) {
                    introMsg = `Cannot ${method} the${sequenceType} sequence '${args[0]}'. The`;
                } else {
                    introMsg = `Executing the${sequenceType} sequence '${args[0]}' despite exceeded length. The`;
                }
                if (
                    typeof args[0] !== 'undefined'
                    && typeof args[0] !== 'string'
                ) {
                    throw new TypeError(`${introMsg} sequence must be a string.`);
                }
                if (typeof args[0] === 'string') {
                    if (args[0].length === 0) {
                        throw new SyntaxError(`Cannot execute empty sequence.`);
                    }
                    else if (! this.#isSequenceLengthWithinLimit(args[0])) {
                        throw new RangeError(`${introMsg}${sequenceType} sequence exceeds the configured 'maxSequenceLength' of ${this.#maxSequenceLength} characters.`);
                    }
                }
                break;
            
            default: break;
        }
    }
}