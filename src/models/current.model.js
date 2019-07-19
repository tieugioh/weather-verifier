class currentModel {
    source = ''
    currentTemp = 0
    feelsLikeTemp = 0
    windSpeed = 0
    windDir = ''
    sunrise = 0
    sunset = 0
    humidity = 0
    weatherIcon = 0
    weatherDesc = ''

    /**
     * TODO - make thresholds configurable via the tool
     * @param {currentModel} data - the current data to compare with
     * @return {Boolean} returns true if any of the the properties have a difference
     *                   beyond the set threshold   
     */
    compare(data) {
        return Math.abs(this.currentTemp - data.currentTemp) > 5 ||
            Math.abs(this.feelsLikeTemp - data.feelsLikeTemp) > 5 ||
            Math.abs(this.windSpeed - data.windSpeed) > 5 ||
            this.windDir !== data.windDir ||
            //this.windDir.charAt(this.windDir.length) !== data.windDir.charAt(data.windDir.length) ||
            Math.abs(this.sunrise - data.sunrise) > 30 ||
            Math.abs(this.sunset - data.sunset) > 30 //||
            //Math.abs(this.humidity - data.humidity) > 5 ||
            //this.weatherIcon === data.weatherIcon ||
            //this.weatherDesc.toLowerCase() === data.weatherDesc.toLowerCase()
    }
}

export default currentModel