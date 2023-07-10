export const operationsStore = {
    'A': (x, y, d) => {
        console.log(`circle(${x}, ${y}, ${d})`);
    },
    'B': (x, y, w, h) => {
        console.log(`rect(${x}, ${y}, ${w}, ${h})`);
    },
};
export const valuesStore = {
    'a': 30,
    'b': 20,
    'c': 55,
};