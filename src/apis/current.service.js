/**
 * Service file that provides methods to get forecast weather data from
 * the interactive portal api
 * 
 * Folders/Files as of 6/5/2019
 * Folders - currentHD<0-1>
 * Files - WS2TEN<0-19>.js
 */
import carConst from '../constants/carousel.constants'
import carousel from './carousel.service'

class currentService {
    static CURR_ENDPT = 'currentHD'
    static CURR_PRE = 'WS2CC'
    static FILES_PER_DIR = 10
    static NUM_OF_DIR = 2

    /**
     * Make request to interactive portal api for weather station to current weather data
     * @param {number} fileNum - the file number to be appended to the filename
     * @param {number} dirNum - the folder number to append to the request
     * @return {Promise} a promise wrapped request
     */
    static getCurrent(fileNum, dirNum) {
        return carousel.get(`/${this.CURR_ENDPT}/${dirNum}/${this.CURR_PRE}${fileNum}.js`)
    }

    /**
     * Gets current condition data for a given range of weather station ids
     * i.e. getCurrentByWeatherStationID(501, 1001) will get files
     * WS2CC<1-2>.js
     * @param {number} start - must be smaller than 10,000 and smaller than end
     * @param {?number} end - must be smaller than 10,000 and greater than start,
     *                        if end is not passed, only one file will be downloaded
     */
    static getCurrentByWeatherStationID(start, end) {
        const startFileNum = Math.floor((start-1)/carConst.WS2_EL_PER_FILE)
        const startDirNum = Math.floor(startFileNum/this.FILES_PER_DIR)
        
        if(!end)
            return [this.getCurrent(startFileNum, startDirNum)]
        
        const endFileNum = Math.ceil((end)/carConst.WS2_EL_PER_FILE)
        const endDirNum = Math.ceil(endFileNum/this.FILES_PER_DIR)

        let requests = []
        let currFile = startFileNum
        let currDir = startDirNum
        
        while(currDir < endDirNum) {
            const stop = endFileNum > (currDir+1) * this.FILES_PER_DIR ? this.FILES_PER_DIR : endFileNum
            
            while(currFile < stop) {
                requests.push(this.getCurrent(currFile, currDir))
                currFile++
            }

            currDir++
        }

        return requests
    }

    /**
     * Make request to interactive portal api for all weather station to current weather data
     * @return {Array<Promise>} pending zip requests
     */
    static getAllCurrent() {
        let requests = []

        for(let i=0;i<this.NUM_OF_DIR;i++)
            for(let j=0;j<this.FILES_PER_DIR;j++)
                requests.push(this.getCurrent(i * this.FILES_PER_DIR + j, i))
            
        return requests
    }
}

export default currentService