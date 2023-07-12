# OpString

OpString is a JavaScript library for mapping and executing operations defined by character sequences.

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Error Handling](#error-handling)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)

<a name="introduction"></a>
## Introduction

Consider the character sequence `AaabBabcc`. When executed, OpString calls the mapped functions `circle(30, 30, 20)` and `rect(30, 20, 55, 55)` with the corresponding values. OpString simplifies the process of mapping characters to functions and values, composing character sequences that represent operations and executing them accordingly.

OpString is particularly useful in scenarios where data saving is crucial. By representing operations using compact character sequences, OpString enables creative coders to pack more functionality into less data, optimizing storage efficiency.

<a name="getting-started"></a>
## Getting Started

Install OpString using `npm`:

```bash
npm install opstring
```

<a name="usage"></a>
## Usage

You can import OpString into your project using the `import` statement, then create a new instance.

```js
import OpString from 'opstring';

// Create a new instance
const opString = new OpString();
```

When using OpString, there are mainly three steps involved:
1. Register operations and values
2. Compose character sequence
3. Execute character sequence

OpString provides flexibility in managing these steps. Below, you will find two approaches for using OpString, which can be combined as needed.

### Approach 1: Register Operations and Values as Needed

With this approach, you start with an empty OpString instance and register operations and values as needed. Then, you compose the character sequence by appending, inserting, prepending and removing operations and their corresponding values.

```js
import OpString from 'opstring';

// Create an empty OpString instance
const opString = new OpString();

// Register operations
opString.registerOperation('A', (x, y, d) => { console.log(x, y, d); });
opString.registerOperation('B', (x, y, w, h) => { console.log(x, y, w, h); });
// Alternatives: `registerOperations` and `setOperations`

// Register values
opString.registerValue('a', 30);
opString.registerValue('b', 20);
opString.registerValue('c', 55);
// Alternatives: `registerValues` and `setValues`

// Compose the character sequence
opString.append('A', ['a', 'a', 'b']);
opString.append('B', ['a', 'b', 'c', 'c']);
// Alternative: `setSequence`

// Set the maximum sequence length
opString.setMaxSequenceLength(10);

// Insert an operation at a specific position
const operationId = opString.insert(1, 'B', ['a', 'b', 'c', 'c']);

// Remove an operation by its ID
opString.remove(operationId);

console.debug(opString.getSequence());
// Expected output: 'AaabBabcc'

// Execute the composed sequence
opString.execute();

// Execute a custom sequence
opString.execute('Babcc');
```

### Approach 2: Define Everything When Creating the OpString Instance

With this approach, you register operations and values, and specify the character sequence when creating the OpString instance.

```js
// Create a new instance and configure it with initial settings
const opString = new OpString({
    sequence: 'AaabBabcc',
    operations: {
        'A': (x, y, d) => { console.log(x, y, d); },
        'B': (x, y, w, h) => { console.log(x, y, w, h); },
    },
    values: { 'a': 30, 'b': 20, 'c': 55 },
    maxSequenceLength: 10,
    ignoreWarnings: false, // (default: false)
    strictMode: true, // (default: false)
});

// Execute the sequence 'AaabBabcc'
opString.execute();

// Execute a custom sequence
opString.execute('Babcc');
```

*Note: The properties `ignoreWarnings` and `strictMode` can only be configured when creating an OpString instance. (see [Error Handling](#error-handling))*

<a name="error-handling"></a>
## Error Handling

OpString aims to handle errors gracefully, providing warnings without interrupting its functionality.

### `ignoreWarnings`

To ignore warnings, you can set `ignoreWarnings` to `true` when creating an OpString instance. When `ignoreWarnings` is `true` and errors occur, warnings will not be logged to the console.

```js
// Create an OpString instance and ignore warnings
const opString = new OpString({
    ignoreWarnings: true, // (default: false)
});
```

### `strictMode`

To enable `strictMode`, you can set `strictMode` to `true` when creating an OpString instance.

In `strictMode`, OpString will log errors instead of warnings to the console. Furthermore, OpString will not be as graceful anymore and certain functionalities like `setSequence` or `execute` will not work when errors, such as exceeding the `maxSequenceLength` limit, occur.

```js
// Create an OpString instance with `strictMode` enabled
const opString = new OpString({
    strictMode: true, // (default: false)
});
```

*Note: In `strictMode`, the `ignoreWarnings` property is irrelevant as warnings are never logged.*

<a name="api"></a>
## API

OpString exposes the following properties and methods:

### Properties

<details>
<summary><code>version</code></summary>
<br>A string representing the version of OpString.

#### Examples

```js
// Access the version of OpString
console.log(opString.version);

// Output: '0.1.0'
```

</br>
</details>

### Methods

<details>
<summary><code>constructor(config?)</code></summary>
<br>Creates an instance of OpString.

### Examples

```js
// Create an empty OpString instance
const opString = new OpString();

// Create an OpString instance and enable `strictMode`
const opString = new OpString({
    strictMode: true, // (default: false)
});

// Create a new instance and configure it with initial settings
const opString = new OpString({
    sequence: 'AaabBabcc',
    operations: {
        'A': (x, y, d) => { console.log(x, y, d); },
        'B': (x, y, w, h) => { console.log(x, y, w, h); },
    },
    values: { 'a': 30, 'b': 20, 'c': 55 },
    maxSequenceLength: 10,
    ignoreWarnings: false, // (default: false)
    strictMode: true, // (default: false)
});
```

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `config?` | `Object` | (Optional) Config object to configure OpString features. |
| `config.sequence?` | `string` | (Optional) The character sequence to be executed when `execute` is called without providing a sequence parameter. (default: '') |
| `config.operations?` | `Object` | (Optional) Object containing the operation mappings to be registered. (default: {}) |
| `config.values?` | `string` | (Optional) Object containing the value mappings to be registered. (default: {}) |
| `config.maxSequenceLength?` | `string` | (Optional) Specifies a maximum allowed sequence length. If defined, it must be a positive safe integer. (default: undefined) |
| `config.ignoreWarnings?` | `string` | (Optional) Specifies whether warnings should be ignored. (default: false) |
| `config.strictMode?` | `string` | (Optional) Specifies the behavior of the OpString with regard to errors. If set to `true`, errors will be logged; otherwise, warnings will be logged. Furthermore, if set to `true` the `maxSequenceLength` must strictly be adhered to, otherwise, the respective character sequence will not be set/executed. (default: false) |

</br>
</details>

<details>
<summary><code>append(operation, values?)</code></summary>
<br>Appends an operation to the sequence and returns the id of the appended operation.

#### Examples

```js
// Append an operation to the sequence and return its id
const operationId = opString.append('V');

// Specify the values to be passed to the operation. This will append 'Aaab' to the sequence.
opString.append('A', ['a', 'a', 'b']);

/**
 * Use character codes instead of characters: 'A'.charCodeAt(0) => 65
 * This will also append 'Aaab' to the sequence.
 */
opString.append(65, [97, 97, 98]);
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `operation` | `string\|number` | The character code of the operation to be appended. |
| `values?` | `Array<string\|number>` | (Optional) An array with the character codes of the values corresponding to the operation to be appended. |

#### Returns

`number|null` - The id of the appended operation or `null` if the operation wasn't appended.

</br>
</details>

<details>
<summary><code>insert(index, operation, values?)</code></summary>
<br>Inserts an operation to the sequence at the specified index and returns the id of the inserted operation.

#### Examples

```js
/**
 * Insert an operation at index 2 of the operations to be executed and returns 
 * its id. The operation will be the third one to be executed.
 */
const operationId = opString.insert(2, 'V');

/**
 * Specify the values to be passed to the operation.
 * 
 * The following example inserts the operation 'Aaab' at index 2 of the
 * operations to be executed, making it the third operation to be executed.
 */
opString.insert(2, 'A', ['a', 'a', 'b']);

/**
 * Use character codes instead of characters: 'A'.charCodeAt(0) => 65
 * This will also insert 'Aaab' at index 2 of the sequence.
 */
opString.insert(2, 65, [97, 97, 98]);
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `index` | `number` | The index at which the operation should be added. |
| `operation` | `string\|number` | The character code of the operation to be appended. |
| `values?` | `Array<string\|number>` | (Optional) An array with the character codes of the values corresponding to the operation to be appended. |

#### Returns

`number|null` - The id of the inserted operation or `null` if the operation wasn't inserted.

</br>
</details>

<details>
<summary><code>prepend(operation, values?)</code></summary>
<br>Prepends an operation to the sequence and returns its id.

#### Examples

```js
// Prepend an operation to the sequence and return its id
const operationId = opString.prepend('V');

// Specify the values to be passed to the operation. This will prepend 'Aaab' to the sequence.
opString.prepend('A', ['a', 'a', 'b']);

/**
 * Use character codes instead of characters: 'A'.charCodeAt(0) => 65
 * This will also prepend 'Aaab' to the sequence.
 */
opString.prepend(65, [97, 97, 98]);
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `operation` | `string\|number` | The character or character code of the operation to be prepended. |
| `values?` | `Array<string\|number>` | (Optional) An array with the characters or character codes of the values corresponding to the operation to be prepended. |

#### Returns

`number|null` - The id of the prepended operation or null if the operation wasn't prepended.

</br>
</details>

<details>
<summary><code>remove(id)</code></summary>
<br>Removes the operation with the specified id from the sequence.

#### Examples

```js
// Remove operation with id 3 from the sequence
const removed = opString.remove(3);
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `number` | The id of the operation that should be removed. |

#### Returns

`boolean` - If the respective operation was removed `true`, otherwise `false`.

</br>
</details>

<details>
<summary><code>setSequence(sequence)</code></summary>
<br>Sets the character sequence.

#### Examples

```js
// Set the character sequence
opString.setSequence('AaabBabcc');

/**
 * Handling an unknown value character
 *
 * Suppose the sequence is 'Ba?c'. The '?' represents an unknown value character.
 * In this case, the unknown character will be registered with a value of null.
 * By registering it this way, the associated operation can still be executed.
 */
opString.setSequence('Ba?c');
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `sequence` | `string` | The character sequence that should be set. |

</br>
</details>

<details>
<summary><code>getSequence()</code></summary>
<br>Returns the character sequence.

#### Examples

```js
// Get the character sequence
const sequence = opString.getSequence();

// Example output: 'AaabBabcc'
```

#### Returns

`string` - The character sequence.

</br>
</details>

<details>
<summary><code>getSequenceData()</code></summary>
<br>Returns the sequence data array.

#### Examples

```js
// Get the sequence data array
const sequenceData = opString.getSequenceData();

// Example output for sequence 'AaabBabcc':
// [
//   { id: 1, operation: 65, values: [ 97, 97, 98 ] },
//   { id: 2, operation: 66, values: [ 97, 98, 99, 99 ] }
// ]
```

#### Returns

`Array<Object>` - The sequence data array

</br>
</details>

<details>
<summary><code>registerOperation(symbol, callback)</code></summary>
<br>Registers an operation mapping.

#### Examples

```js
// Register an operation mapping
opString.registerOperation('X', () => console.log('Operation X'));

// Register an operation mapping using character code
opString.registerOperation(88, () => console.log('Operation X'));
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `symbol` | `string|number` | The character or character code to be mapped to a function. |
| `callback` | `function` | The function to which the symbol should be mapped. |

</br>
</details>

<details>
<summary><code>registerOperations(operations)</code></summary>
<br>Registers additional operation mappings provided by the `operations` object.

#### Examples

```js
// Register additional operation mappings
opString.registerOperations({
    'D': () => { /*...*/ },
    'E': () => { /*...*/ },
    'F': () => { /*...*/ },
});

// Register additional operation mappings using chracter codes
opString.registerOperations({
    68: () => { /*...*/ },
    69: () => { /*...*/ },
    70: () => { /*...*/ },
});
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `operations` | `Object` | Object containing additional operation mappings to be registered. |

</br>
</details>

<details>
<summary><code>setOperations(operations)</code></summary>
<br>Registers the operation mappings provided by the `operations` object. Previously registered operation mappings will be deleted.

#### Examples

```js
// Set new operation mappings
opString.setOperations({
    'A': () => { /*...*/ },
    'B': () => { /*...*/ },
    'C': () => { /*...*/ },
});
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `operations` | `Object` | Object containing new operation mappings to be registered. |

</br>
</details>

<details>
<summary><code>getOperations()</code></summary>
<br>Returns the registered operations.

#### Examples

```js
// Get the registered operations
const operations = opString.getOperations();

// Example output:
// { '65': [Function: A], '66': [Function: B] }
```

#### Returns

`Object` - The registered operations

</br>
</details>

<details>
<summary><code>registerValue(symbol, value)</code></summary>
<br>Registers a value mapping.

#### Examples

```js
// Register a value mapping
opString.registerValue('x', 10);

// Register a value mapping using character code
opString.registerValue(120, 10);
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `symbol` | `string|number` | The character or character code to be mapped to a value. |
| `value` | `*` | The value to which the symbol should be mapped. |

</br>
</details>

<details>
<summary><code>registerValues(values)</code></summary>
<br>Registers additional value mappings provided by the `values` object.

#### Examples

```js
// Register additional value mappings
opString.registerValues({
    'x': 10,
    'y': 11,
    'z': 12,
});

// Register additional value mappings using character codes
opString.registerValues({
    120: 10,
    121: 11,
    122: 12,
});
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `values` | `Object` | Object containing additional value mappings to be registered. |

</br>
</details>

<details>
<summary><code>setValues(values)</code></summary>
<br>Registers the value mappings provided by the `values` object. Previously registered value mappings will be deleted.

#### Examples

```js
// Set new value mappings
opString.setValues({
    'a': 1,
    'b': 2,
    'c': 3,
});

// Set new value mappings using character codes
opString.setValues({
    97: 1,
    98: 2,
    99: 3,
});
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `values` | `Object` | Object containing new value mappings to be registered. |

</br>
</details>

<details>
<summary><code>getValues()</code></summary>
<br>Returns the registered values.

#### Examples

```js
// Get the registered values
const values = opString.getValues();

// Example output:
// { '97': 30, '98': 20, '99': 55 }
```

#### Returns

`Object` - The registered values.

</br>
</details>

<details>
<summary><code>setMaxSequenceLength(maxSequenceLength)</code></summary>
<br>Sets the maximum allowed sequence limit.

#### Examples

```js
// Set the maximum sequence length to 100
opString.setMaxSequenceLength(100);
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `maxSequenceLength` | `number` | The maximum allowed sequence length. |

</br>
</details>

<details>
<summary><code>getMaxSequenceLength()</code></summary>
<br>Returns the configured `maxSequenceLength` value. If the `maxSequenceLength` has not been configured, `undefined` is returned.

#### Examples

```js
// Get the max sequence length
const maxSequenceLength = opString.getMaxSequenceLength();

// Example output, if configured: 100

// Output, if not configured: undefined
```

#### Returns

`number|undefined` - The configured `maxSequenceLength` value, or `undefined` if not configured.

</br>
</details>

<details>
<summary><code>execute(sequence?)</code></summary>
<br>Attempts to execute the character sequence of the current instance or a provided character sequence specified by the `sequence` parameter.

#### Examples

```js
// Execute the character sequence of the current instance
opString.execute();

// Execute a provided character sequence
opString.execute('XxxyYxyzz');
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `sequence` | `string` | (Optional) The character sequence to be executed instead of the character sequence of the current instance. |

</br>
</details>

<a name="contributing"></a>
## Contributing

Are you considering contributing to OpString? Check out our [contributing guidelines](./CONTRIBUTING.md).

<a name="license"></a>
## License

OpString is [MIT licensed](./LICENSE).
