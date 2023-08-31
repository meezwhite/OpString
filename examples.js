import OpString from './dist/opstring.js';
// import OpString from './index.js';

/**
 * Example 1
 */
console.log('\n--- Example 1 (constructor) ---\n');

const operations = {
    'A': (x, y, d) => {
        console.log(`> circle(${x}, ${y}, ${d})`);
    },
    'B': (x, y, w, h) => {
        console.log(`> rect(${x}, ${y}, ${w}, ${h})`);
    },
};
const values = {
    'a': 30,
    'b': 20,
    'c': 55,
};
const labels = {
    'circle': 'A',
    'rect': 'B',
    'thirty': 'a',
    'twenty': 'b',
    'fifty-five': 'c',
}
const opString = new OpString({
    sequence: 'AaabBabcc',
    operations,
    values,
    labels,
});


// Values
console.log(opString.getValues());
// Output:
// { '97': 30, '98': 20, '99': 55 }

console.log(opString.getCharForValue(55));
// Output: 'c'

console.log(opString.getCharCodeForValue(55));
// Output: 99


// Labels
console.log(opString.getLabels());
// Output:
// { 'circle': 65, 'rect': 66, 'thirty': 97, 'twenty': 98, 'fifty-five': 99 }

console.log(opString.getCharForLabel('circle'));
// Output: 'A'

console.log(opString.getCharCodeForLabel('circle'));
// Output: 65

console.log(opString.getCharForLabel('seventy-seven'));
// Output: undefined


opString.execute();

// Output:
// > circle(30, 30, 20)
// > rect(30, 20, 55, 55)


/**
 * Example 2
 */
console.log('\n--- Example 2 (registerOperation, registerValue, registerLabel, setSequence) ---\n');

opString.registerOperation('C', (x1, y1, x2, y2, x3, y3) => {
    console.log(`> triangle(${x1}, ${y1}, ${x2}, ${y2}, ${x3}, ${y3})`);
});
opString.registerLabel('triangle', 'C');

opString.registerValue('d', 75);
opString.registerValue('e', 58);
opString.registerValue('f', 86);
opString.setSequence('AaabBabccCadebfd');
opString.execute();

// Output:
// > circle(30, 30, 20)
// > rect(30, 20, 55, 55)
// > triangle(30, 75, 58, 20, 86, 75);


/**
 * Example 3
 */
console.log('\n--- Example 3 (sequenceData) ---\n');

console.log(opString.getSequenceData());
console.log(`nextId: ${opString.getNextId()}`);

// Output:
// [
//     { id: 3, operation: 65, values: [ 97, 97, 98 ] },
//     { id: 4, operation: 66, values: [ 97, 98, 99, 99 ] },
//     { id: 5, operation: 67, values: [ 97, 100, 101, 98, 102, 100 ] }
// ]
// nextId: 6


/**
 * Example 4
 */
console.log('--- Example 4 (remove) ---');

opString.remove(3);
console.log(opString.getSequenceData());
console.log(opString.getSequence());

// Output:
// [
//     { id: 4, operation: 66, values: [ 97, 98, 99, 99 ] },
//     { id: 5, operation: 67, values: [ 97, 100, 101, 98, 102, 100 ] }
// ]
// BabccCadebfd


/**
 * Example 5
 */
console.log('\n--- Example 5 (append) ---\n');

const operationChar = opString.getCharForLabel('circle'); // Returns: 'A'
const operationCharCode = opString.getCharCodeForLabel('circle'); // Returns: 65

const appendedId = opString.append('A', ['a', 'a', 'b']);
// const appendedId = opString.append(operationChar, ['a', 'a', 'b']);
// const appendedId = opString.append(operationCharCode, ['a', 'a', 'b']);
opString.execute();

// Output:
// > rect(30, 20, 55, 55)
// > triangle(30, 75, 58, 20, 86, 75);
// > circle(30, 30, 20)


/**
 * Example 6
 */
console.log('\n--- Example 6 (prepend) ---\n');

// opString.prepend('A'.charCodeAt(0), ['a'.charCodeAt(0), 'a'.charCodeAt(0), 'b'.charCodeAt(0)]);
const prependedId = opString.prepend(65, [97, 97, 98]);
opString.execute();

// Output:
// > circle(30, 30, 20)
// > rect(30, 20, 55, 55)
// > triangle(30, 75, 58, 20, 86, 75);
// > circle(30, 30, 20)


/**
 * Example 7
 */
console.log('\n--- Example 7 (index) ---\n');

// Get the index of operation with id 4 in the sequence
const operationIndex = opString.index(4);
console.log(`> index of operation with id 4 in the sequence: ${operationIndex}`);

// Output:
// > index of operation with id in the sequence: 1


/**
 * Example 8
 */
console.log('\n--- Example 8 (insert) ---\n');

opString.registerOperation('G', (log) => {
    console.log(`> ${log}`);
});
opString.registerValue('g', 'Inserted operation at index 1');
if (operationIndex !== undefined) {
    const insertedId = opString.insert(operationIndex, 'G', ['g']);
}
opString.execute();

// Output:
// > circle(30, 30, 20)
// > Inserted operation at index 1
// > rect(30, 20, 55, 55)
// > triangle(30, 75, 58, 20, 86, 75);
// > circle(30, 30, 20)


/**
 * Example 9
 */
console.log('\n--- Example 9 (getSequence) ---\n');

console.log('>', opString.getSequence(), `(Length: ${opString.getSequence().length})`);

// Output:
// > AaabGgBabccCadebfdAaab (Length: 22)


/**
 * Example 10
 */
console.log('\n--- Example 10 (maxSequenceLength) ---\n');

opString.setMaxSequenceLength(20);
opString.execute();

// Output:
// [OpString] RangeError: Executing the sequence 'AaabGgBabccCadebfdAaab' despite exceeded length. The sequence exceeds the configured 'maxSequenceLength' of 20 characters.
// > circle(30, 30, 20)
// > Inserted operation at index 1
// > rect(30, 20, 55, 55)
// > triangle(30, 75, 58, 20, 86, 75)
// > circle(30, 30, 20)


/**
 * Example 11
 */
console.log('\n--- Example 11 (ignoreWarnings) ---\n');

const opString2 = new OpString({
    sequence: 'BabccBabccBabccBabccBabcc',
    operations,
    values,
    maxSequenceLength: 20,
    ignoreWarnings: false,
});
opString2.execute();

// Output:
// [OpString] RangeError: Setting the sequence to 'BabccBabccBabccBabccBabcc' despite exceeded length. The provided sequence exceeds the configured 'maxSequenceLength' of 20 characters.
// [OpString] RangeError: Executing the sequence 'BabccBabccBabccBabccBabcc' despite exceeded length. The sequence exceeds the configured 'maxSequenceLength' of 20 characters.
// > rect(30, 20, 55, 55)
// > rect(30, 20, 55, 55)
// > rect(30, 20, 55, 55)
// > rect(30, 20, 55, 55)
// > rect(30, 20, 55, 55)


/**
 * Example 12
 */
console.log('\n--- Example 12 (strictMode) ---\n');

const opString3 = new OpString({
    sequence: 'BabccBabccBabccBabccBabcc',
    operations,
    values,
    maxSequenceLength: 20,
    strictMode: true,
    ignoreWarnings: false, // NOTE: when strictMode is `true`, ignoreWarnings doesn't matter
});
opString3.execute();

// Output:
// [OpString] RangeError: Cannot setSequence to 'BabccBabccBabccBabccBabcc'. The provided sequence exceeds the configured 'maxSequenceLength' of 20 characters.
// [OpString] SyntaxError: Cannot execute empty sequence.

console.log('\n');
