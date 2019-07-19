class forecastModel {
    source = ''
    dayOneHi = 0
    dayOneLo = 0
    dayTwoHi = 0
    dayTwoLo = 0
    dayThreeHi = 0
    dayThreeLo = 0
    dayFourHi = 0
    dayFourLo = 0
    dayFiveHi = 0
    dayFiveLo = 0
    daySixHi = 0
    daySixLo = 0
    daySevenHi = 0
    daySevenLo = 0
    dayEightHi = 0
    dayEightLo = 0
    dayNineHi = 0
    dayNineLo = 0
    dayTenHi = 0
    dayTenLo = 0

    compare(data) {
        return Math.abs(this.dayOneHi - data.dayOneHi) > 5 ||
            Math.abs(this.dayOneLo - data.dayOneLo) > 5 ||
            
            Math.abs(this.dayTwoHi - data.dayTwoHi) > 5 ||
            Math.abs(this.dayTwoLo - data.dayTwoLo) > 5 ||

            Math.abs(this.dayThreeHi - data.dayThreeHi) > 5 ||
            Math.abs(this.dayThreeLo - data.dayThreeLo) > 5 ||

            Math.abs(this.dayFourHi - data.dayFourHi) > 5 ||
            Math.abs(this.dayFourLo - data.dayFourLo) > 5 ||

            Math.abs(this.dayFiveHi - data.dayFiveHi) > 5 ||
            Math.abs(this.dayFiveLo - data.dayFiveLo) > 5 ||

            Math.abs(this.daySixHi - data.daySixHi) > 5 ||
            Math.abs(this.daySixLo - data.daySixLo) > 5 ||

            Math.abs(this.daySevenHi - data.daySevenHi) > 5 ||
            Math.abs(this.daySevenLo - data.daySevenLo) > 5 ||

            Math.abs(this.dayEightHi - data.dayEightHi) > 5 ||
            Math.abs(this.dayEightLo - data.dayEightLo) > 5 //||

            // Math.abs(this.dayNineHi - data.dayNineHi) > 5 ||
            // Math.abs(this.dayNineLo - data.dayNineLo) > 5 ||
            
            // Math.abs(this.dayTenHi - data.dayTenHi) > 5 ||
            // Math.abs(this.dayTenLo - data.dayTenLo) > 5
    }
}

export default forecastModel