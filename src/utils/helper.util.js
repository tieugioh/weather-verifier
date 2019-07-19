/**
 * Clones an object with properties and functions. retains type if object was created from class
 * @param {any} obj - object to clone
 * @param {?any} props - additional properties to add to the clone
 * @return {any}
 */
export const clone = (obj, props) => {
    const proto = Object.create(Object.getPrototypeOf(obj))
    return props ? Object.assign(proto, obj, props) : Object.assign(proto, obj)
}

/**
 * Converts number to string and adds enough leading zeroes
 * to make string of length 5
 * @param {number} num 
 */
export const addLeadingZeroes = num => {
    let str = num.toString()

    for(let i=str.length; i<5; i++)
        str = '0' + str

    return str
}