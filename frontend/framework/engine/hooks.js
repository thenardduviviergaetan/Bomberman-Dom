
/**
 * Creates a state hook with the given initial value.
 * @param {*} defaultValue - The initial value of the state.
 * @returns {Array} - An array containing two functions: getValue --> the state and setValue --> which set the state.
 */
export const useState = (defaultValue) => {
    let value = defaultValue;
    const getValue = () => value
    const setValue = newValue => value = newValue
    return [getValue, setValue];
}
