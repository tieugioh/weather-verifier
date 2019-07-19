/**
 * Service file that provides methods to get forecast weather data from
 * the interactive portal api
 * 
 * Folders/Files as of 6/5/2019
 * Folders - forecast<0-3>
 * Files - WS2TEN<0-19>.js
 */

import carConst from '../constants/carousel.constants'
import carousel from './carousel.service'

class forecastService {
    static FORE_ENDPT = 'forecast'
    static FORE_PRE = 'WS2TEN'
    static FILES_PER_DIR = 5
    static NUM_OF_DIR = 4

    /**
     * Make request to interactive portal api for weather station to forecast data
     * @param {number} fileNum - the file number to be appended to the filename
     * @param {number} dirNum - the folder number to append to the request
     * @return {Promise} a promise wrapped request
     */
    static getForecast(fileNum, dirNum) {
        return carousel.get(`/${this.FORE_ENDPT}${dirNum}/${this.FORE_PRE}${fileNum}.js`)
    }
    
    /**
     * TODO - dupe code from current.service, maybe create a shared service util ?
     * Gets forecast condition data for a given range of weather station ids
     * i.e. getForecastByWeatherStationID(501, 1001) will get files
     * WS2CC<1-2>.js
     * @param {number} start - must be smaller than 10,000 and smaller than end
     * @param {?number} end - must be smaller than 10,000 and greater than start,
     *                        if end is not passed, only one file will be downloaded
     * @return {Array<Promise>} pending forecast requests
     */
    static getForecastByWeatherStationID(start, end) {
        const startFileNum = Math.floor((start-1)/carConst.WS2_EL_PER_FILE)
        const startDirNum = Math.floor(startFileNum/this.FILES_PER_DIR)
        
        if(!end < 2)
            return [this.getForecast(startFileNum, startDirNum)]
        
        const endFileNum = Math.ceil((end)/carConst.WS2_EL_PER_FILE)
        const endDirNum = Math.ceil(endFileNum/this.FILES_PER_DIR)

        let requests = []
        let currFile = startFileNum
        let currDir = startDirNum
        
        while(currDir < endDirNum) {
            const dirSub = (currDir+1) * this.FILES_PER_DIR
            const stop = endFileNum > dirSub ? dirSub : endFileNum
            
            while(currFile < stop) {
                requests.push(this.getForecast(currFile, currDir))
                currFile++
            }

            currDir++
        }

        return requests
    }

    /**
     * Make request to interactive portal api for all weather station to forecast data
     * @return {Array<Promise>} pending forecast requests
     */
    static getAllForecast() {
        let requests = []
    
        for(let i=0;i<this.NUM_OF_DIR;i++)
            for(let j=0;j<this.FILES_PER_DIR;j++)
                requests.push(this.getForecast(i * this.FILES_PER_DIR + j, i))
            
        return requests
    }
}

export default forecastService