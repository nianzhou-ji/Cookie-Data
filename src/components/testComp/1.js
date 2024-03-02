function mergeArrays(arrays) {
    let map = new Map();

    arrays.forEach(array => {
        array.forEach(obj => {
            map.set(obj.id, obj);
        });
    });

    return Array.from(map.values());
}



let a = [{id: 1, value: 3}, {id: 2, value: 4}];
let b = [{id: 1, value: 4}, {id: 3, value: 4}];
let c = [{id: 2, value: 5}, {id: 4, value: 6}];

let result = mergeArrays([a, b, c]);
console.log(result)