/**
 * Model for carousel weather data
 * TODO - comment and clean up some bad practice code
 */

import carConst from '../constants/carousel.constants'
import currentModel from './current.model'
import forecastModel from './forecast.model';
class carouselModel {
    TEMP_OFFSET = 75

    BYTES_CURR = 14
    BYTES_FORE = 29

    WIND_DIR = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW','CALM']
    WEATH_DESC = [
        'Tornado','Tropical Storm','Hurricane','Strong Thunderstorms','Thunderstorms','Rain and Snow','Rain and Sleet',
        'Wintry Mix','Freezing Drizzle','Drizzle','Freezing Rain','Showers','Rain','Flurries','Snow Showers','Blowing Snow',
        'Snow','Hail','Sleet','Dust','Fog','Haze','Smoke','Breezy','Windy','Frigid','Cloudy','Mostly Cloudy','Mostly Cloudy',
        'Partly Cloudy','Partly Cloudy','Clear','Sunny','Mostly Cloudy','Mostly Sunny','Mixed Rainfall','Hot','Isolated T-storms',
        'Scattered T-storms','Scattered Showers','Heavy Rain','Scattered Snow Showers','Heavy Snow','Blizzard','Not Available',
        'Scattered Showers','Scattered Snow Showers','Scattered Thunderstorms'
    ]
    DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

    _weatherStationIDs = []
    _currentConditions = {}
    _forecast = {}

    constructor(zipData) {
        if(zipData) this.updateWeatherStationIDs(zipData)
    }

    updateWeatherStationIDs(zipData) {
        zipData.forEach(str => this._addZ2WSData(str))
    }

    updateCurrentConditions(currData, index) {
        currData.forEach( str => {
            this._addWS2Data(str, this.BYTES_CURR, index)
            index += carConst.WS2_EL_PER_FILE
        })
    }

    updateForecastConditions(foreData, index) {
        foreData.forEach( str => {
            this._addWS2Data(str, this.BYTES_FORE, index)
            index += carConst.WS2_EL_PER_FILE
        })
    }

    isValidZipcode(zipcode) { return this._weatherStationIDs[zipcode] > 0 }

    /**
     * Gets a singular or range of weather station id(s)
     * @param {number} start 
     * @param {number} end 
     * @return {Array<number>} 
     *      - Returns [0] if there are no ids for the given zipcode(s)
     *      - Returns a 2 element array if there exists a weather station range
     *        range[0] is starting, range[1] is ending
     */
    getWeatherStationID(start, end) {
        if(!end) return [this._weatherStationIDs[start]]
        
        const wsIDs = this._weatherStationIDs.slice(start, end+1)
        
        let min = Infinity,
            max = -Infinity

        wsIDs.forEach(num => {
            min = num > 0 ? Math.min(num, min) : min
            max = Math.max(num, max)
        })

        if(max === 0)
            return [0]
        
        if(min === Infinity && max > 0)
            return [1, max]

        return [min, max]
    }

    getCurrentConditions(start, end) {
        let currConList = {}

        for(let i=start; i<end+1; i++) {
            const currCon = this._parseCurrentConditions(i)

            if(currCon)
                currConList[i] = currCon
        }

        return currConList
    }

    getTenDay(start, end) {
        let tenDayList = {}

        for(let i=start; i<end+1; i++) {
            const tenDay = this._parseTenDay(i)

            if(tenDay)
                tenDayList[i] = tenDay
        }

        return tenDayList
    }

    /**
     * Given a zipcode, will return a currentModel Object
     * @param {number} zipcode 
     * @return {currentModel} 
     */
    _parseCurrentConditions(zipcode) {
        const wsID = this.getWeatherStationID(zipcode)[0]
        let currCon = null

        if(this._currentConditions[wsID]) {
            const data = this._currentConditions[wsID]
            
            currCon = new currentModel()
            currCon.source = 'Carousel'
            currCon.currentTemp = this._normalizeTemp(data[0])
            currCon.feelsLikeTemp = this._normalizeTemp(data[1])
            currCon.windSpeed = data[2]
            currCon.windDir = this.WIND_DIR[data[3]] ? this.WIND_DIR[data[3]] : ''
            currCon.sunrise = data[4] * 60 + data[5]
            currCon.sunset = data[6] * 60 + data[7]
            currCon.humidity = data[8] //not sure this byte maps to humidity anymore
            currCon.weatherIcon = data[9]
            currCon.weatherDesc = this.WEATH_DESC[data[9]] ? this.WEATH_DESC[data[9]] : ''
        }

        return currCon
    }

    _parseTenDay(zipcode) {
        const wsID = this.getWeatherStationID(zipcode)[0]
        let tenDay = null

        if(this._forecast[wsID]) {
            const data = this._forecast[wsID]

            tenDay = new forecastModel()
            tenDay.source = 'Carousel'
            tenDay.dayOneHi = this._normalizeTemp(data[2])
            tenDay.dayOneLo = this._normalizeTemp(data[3])
            tenDay.dayTwoHi = this._normalizeTemp(data[5])
            tenDay.dayTwoLo = this._normalizeTemp(data[6])
            tenDay.dayThreeHi = this._normalizeTemp(data[9])
            tenDay.dayThreeLo = this._normalizeTemp(data[10])
            tenDay.dayFourHi = this._normalizeTemp(data[12])
            tenDay.dayFourLo = this._normalizeTemp(data[13])
            tenDay.dayFiveHi = this._normalizeTemp(data[16])
            tenDay.dayFiveLo = this._normalizeTemp(data[17])
            tenDay.daySixHi = this._normalizeTemp(data[19])
            tenDay.daySixLo = this._normalizeTemp(data[20])
            tenDay.daySevenHi = this._normalizeTemp(data[23])
            tenDay.daySevenLo = this._normalizeTemp(data[24])
            tenDay.dayEightHi = this._normalizeTemp(data[26])
            tenDay.dayEightLo = this._normalizeTemp(data[27])
            // tenDay.dayNineHi = data[]
            // tenDay.dayNineLo = data[]
            // tenDay.dayTenHi = data[]
            // tenDay.dayTenLo = data[]
        }

        return tenDay
    }

    _normalizeTemp(temp) {
        return temp !== 255 ? temp - this.TEMP_OFFSET : 0
    }

    _addZ2WSData(zipStr) {
        const startRegex = /]="/m
        const endRegex = /";Z2WS\[/m

        let startIndex = 0
        let endIndex = 0
        let startMatch
        let endMatch
        
        while((startMatch = startRegex.exec(zipStr)) !== null && 
            (endMatch = endRegex.exec(zipStr)) !== null) {

            startIndex = startMatch.index + 3
            endIndex = endMatch.index
            const decompressedData = this._decompress(zipStr.substring(startIndex, endIndex))
            decompressedData.forEach(data => this._weatherStationIDs.push(data))
            zipStr = zipStr.substring(endIndex + 6)
        }
        
        //push final element
        const decompressedData = this._decompress(zipStr.substring(startIndex, zipStr.length - 2))
        decompressedData.forEach(data => this._weatherStationIDs.push(data))
    }

    _addWS2Data(currStr, bytes, index) {
        const regex = /","/m
        const endIndexOffset = 3

        let dataObj = bytes === this.BYTES_CURR ? this._currentConditions : this._forecast
        let endIndex = 0
        let match

        //remove entire portion of string before WS2 array is initialized
        currStr = currStr.substring(/Array\("/m.exec(currStr).index + 7)
        
        //had to extract function from while loop, linter warns with no-loop-func
        const appendData = data => dataObj[index++] = data

        while((match = regex.exec(currStr)) !== null) {
            endIndex = match.index
            const decodedData = this._decode(currStr.substring(0, endIndex), bytes) 
            decodedData.forEach(appendData)
            currStr = currStr.substring(endIndex + endIndexOffset)
        }

        //push final element
        const decodedData = this._decode(currStr.substring(0, currStr.length - 3), bytes)
        decodedData.forEach(appendData)
    }

    _decompress(textStr) {
        return this._decompressHex(this._removeEscapeChars(this._textToHex(textStr)))
    }

    _decode(textStr, bytes) {
        return this._decodeWS2Data(this._removeEscapeChars(this._textToHex(textStr)), bytes)
    }

    _textToHex(textStr) {
        let hexStr = ''
    
        for(const char of textStr) {
            const hexChar = char.charCodeAt(0).toString(16).toUpperCase()
            hexStr += hexChar.length >= 2 ? hexChar : `0${hexChar}`
        }
    
        return hexStr
    }

    _removeEscapeChars(hexStr) {
        const ESC_CHAR = '5C',
              NEW_LINE = '0A',
              CARRIDGE_RETURN ='0D'
           
        let strSrchIdx = 0
        let fndIdx = hexStr.indexOf(ESC_CHAR, strSrchIdx)
    
        while(fndIdx !== -1) {
            if(fndIdx % 2 !== 0)
                strSrchIdx = fndIdx + 1
            else {
                const nextHex = hexStr.substr(fndIdx + 2, 2)
                strSrchIdx = nextHex === ESC_CHAR ? fndIdx + 2 : fndIdx
    
                switch(nextHex) {
                    case '6E':
                        hexStr = hexStr.substring(0,fndIdx) + NEW_LINE + hexStr.substring(fndIdx + 4)
                        break
                    case '72':
                        hexStr = hexStr.substring(0,fndIdx) + CARRIDGE_RETURN + hexStr.substring(fndIdx + 4)
                        break
                    default:
                        hexStr = hexStr.substring(0,fndIdx) + hexStr.substring(fndIdx + 2)
                } 
            }
            
            fndIdx = hexStr.indexOf(ESC_CHAR, strSrchIdx)
        }
    
        return hexStr
    }

    _decompressHex(compressedStr) {
        const len = compressedStr.length/4
        let decompressedList = []
    
        for(let i=0;i<len;i++) {
            const data = parseInt(compressedStr.substr(i*4, 4), 16)
            
            if(data >= 0x8000) {
                const arrayOfZeroes = Array(data & 0x7fff).fill(0)
                decompressedList = [...decompressedList, ...arrayOfZeroes]
            } else {
                decompressedList.push(data)
            }
        }
    
        return decompressedList
    }

    _decodeWS2Data(dataStr, bytes) {
        
        const totalValues = 100

        let dataArr = []

        for(let i=0;i<totalValues;i++) {
            let subArr = []
            for(let j=0;j<bytes;j++) {
                const index = ((bytes * i) + j) * 2
                const endIndex = index + 2
                const hexStr = dataStr.substring(index, endIndex)

                if(hexStr !== '')
                    subArr.push(parseInt(hexStr, 16))
            }

            dataArr[i] = subArr
        }

        return dataArr
    }
}

export default carouselModel
