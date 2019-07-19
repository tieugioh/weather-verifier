/**
 * Custom layer for native js localStorage object to allow for
 * adding values with expiry time and removing values that have
 * expired
 */

const localStorageUtil = {
    /**
     * Parses and returns the value for a key
     * Removes value if expired
     * @param {string} key 
     */
    getItem: function(key) {
        const storageObj = JSON.parse(localStorage.getItem(key))

        if(storageObj && 
            storageObj.expiry !== null && 
            storageObj.expiry <= Date.now()) {
                
            localStorage.removeItem(key)
            return null
        }
            
        return storageObj ? JSON.parse(storageObj.value) : null
    },

    /**
     * Saves value with key to localstorage
     * also has the option of setting expiry time
     * @param {string} key 
     * @param {any} value
     * @param {?number} expiry - minutes before data expires
     */
    setItem: function(key, value, expiry = null) {
        expiry = expiry ? expiry * 60 * 1000 + Date.now() : null
        localStorage.setItem(key, JSON.stringify({ value, expiry }))
    }
}

export default localStorageUtil