class weatherModel {
    _currentConditions = {}
    _tenDay = {}

    setCurrentConditions(data) {
        this._currentConditions = data
    }

    setTenDay(data) {
        this._tenDay = data
    }

    getCurrentConditions() {
        return this._currentConditions
    }

    getTenDay() {
        return this._tenDay
    }
}

export default weatherModel