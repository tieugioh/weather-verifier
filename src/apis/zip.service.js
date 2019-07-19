/**
 * Service file that provides methods to get zip code weather data from
 * the interactive portal api
 * 
 * Files as of 6/5/2019
 * Z2WS<0-9>.js
 */

import carousel from './carousel.service'
import localStorageUtil from '../utils/localStorage.util'

class zipService {
    static ZIP_ENDPT = 'zip'
    static ZIP_PRE = 'Z2WS'

    /**
     * Make request to interactive portal api for zip to weather station id data
     * http://10.26.74.246:8080/interactiveportal/rest/itvidContent/On-Air-CGS/TWCHD/zip/Z2WS0.js
     * @param {number} fileNum - the file number to be appended to the filename
     * @return {Promise} a promise wrapped request
     */
    static getZip(fileNum) {
        return carousel.get(`/${this.ZIP_ENDPT}/${this.ZIP_PRE}${fileNum}.js`)
    }

    /**
     * gets all weather station data
     * @return {Promise<Array<string>>} 
     */
    static async getAllZip() {
        const key = 'weatherStationIDs'
        const expiry = 24 * 60 //minutes
        let wsIDs = localStorageUtil.getItem(key)

        if(!wsIDs) {
            wsIDs = await Promise.all(this.getAllZipFromCarousel())
            localStorageUtil.setItem(key, JSON.stringify(wsIDs), expiry)
        }

        return Promise.resolve(wsIDs)
    }

    /**
     * Make request to interactive portal api for all zip to weather station id data
     * @return {Array<Promise>} pending zip requests
     */
    static getAllZipFromCarousel() {
        const totalFiles = 10
        let requests = []

        for(let i=0;i<totalFiles;i++)
            requests.push(this.getZip(i))

        return requests
    }
}

export default zipService