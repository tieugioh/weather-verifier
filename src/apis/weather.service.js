import axios from 'axios'
import currentModel from '../models/current.model'
import forecastModel from '../models/forecast.model'

class weatherService {
    static HOST = 'https://api.weather.com/v1/location'
    static API_KEY = 'c4e4b15f1d05597326f76fe29196faf8'
    static CURR_ENDPT = 'observations/current.json'
    static TEN_DAY_ENDPT = 'forecast/daily/10day.json'

    /**
     * http://api.weather.com/v1/location/91007:4:US/observations/current.json?language=en-US&units=e&apiKey=c4e4b15f1d05597326f76fe29196faf8
     * @param {number} zipcode 
     */
    static getCurrent(zipcode) {
        const request = axios.create({
            baseURL: `${this.HOST}/${zipcode}:4:US`,
            params: {
                language: 'en-US',
                units: 'e',
                apiKey: this.API_KEY
            }
        })

        request.interceptors.response.use(res => this._parseCurrentConditions(res.data.observation))

        return request.get(this.CURR_ENDPT)
    }

    /**
     * http://api.weather.com/v1/location/91007:4:US/forecast/daily/10day.json?language=en-US&units=e&apiKey=c4e4b15f1d05597326f76fe29196faf8
     * @param {number} zipcode 
     */
    static getTenDay(zipcode) {
        const request = axios.create({
            baseURL: `${this.HOST}/${zipcode}:4:US`,
            params: {
                language: 'en-US',
                units: 'e',
                apiKey: this.API_KEY
            }
        })

        request.interceptors.response.use(res => this._parseTenDayForecast(res.data.forecasts))

        return request.get(this.TEN_DAY_ENDPT)
    }

    static _parseCurrentConditions(data) {
        const sunriseDate = new Date(data.sunrise)
        const sunsetDate = new Date(data.sunset)

        let currCon = new currentModel()
            currCon.source = 'Weather Channel'
            currCon.currentTemp = data.imperial.temp
            currCon.feelsLikeTemp = data.imperial.feels_like
            currCon.windSpeed = data.imperial.wspd
            currCon.windDir = data.wdir_cardinal
            currCon.sunrise = sunriseDate.getHours() * 60 + sunriseDate.getMinutes()
            currCon.sunset = sunsetDate.getHours() * 60 + sunsetDate.getMinutes()
            currCon.humidity = 0 // not sure what maps to this
            currCon.weatherIcon = data.icon_code
            currCon.weatherDesc = data.phrase_32char

        return currCon
    }

    static _parseTenDayForecast(data) {
        let tenDay = new forecastModel()
            tenDay.source = 'Weather Channel'
            tenDay.dayOneHi = data[0].max_temp ? data[0].max_temp : 0
            tenDay.dayOneLo = data[0].min_temp ? data[0].min_temp : 0
            tenDay.dayTwoHi = data[1].max_temp ? data[1].max_temp : 0
            tenDay.dayTwoLo = data[1].min_temp ? data[1].min_temp : 0
            tenDay.dayThreeHi = data[2].max_temp ? data[2].max_temp : 0
            tenDay.dayThreeLo = data[2].min_temp ? data[2].min_temp : 0
            tenDay.dayFourHi = data[3].max_temp ? data[3].max_temp : 0
            tenDay.dayFourLo = data[3].min_temp ? data[3].min_temp : 0
            tenDay.dayFiveHi = data[4].max_temp ? data[4].max_temp : 0
            tenDay.dayFiveLo = data[4].min_temp ? data[4].min_temp : 0
            tenDay.daySixHi = data[5].max_temp ? data[5].max_temp : 0
            tenDay.daySixLo = data[5].min_temp ? data[5].min_temp : 0
            tenDay.daySevenHi = data[6].max_temp ? data[6].max_temp : 0
            tenDay.daySevenLo = data[6].min_temp ? data[6].min_temp : 0
            tenDay.dayEightHi = data[7].max_temp ? data[7].max_temp : 0
            tenDay.dayEightLo = data[7].min_temp ? data[7].min_temp : 0
            // tenDay.dayNineHi = data[]
            // tenDay.dayNineLo = data[]
            // tenDay.dayTenHi = data[]
            // tenDay.dayTenLo = data[]
        return tenDay
    }
}

export default weatherService