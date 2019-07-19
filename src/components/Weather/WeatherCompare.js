import React from 'react'
import { connect } from 'react-redux'
import WeatherForm from './WeatherForm'
import { createLoadingSelector } from '../../apis/selectors'
import {
    selectWeatherType,
    compareCurrentConditions, 
    compareTenDayForecast 
} from '../../actions'

class WeatherCompare extends React.Component {
    onSubmit = ({ start, end }) => {
        const { compareCurrentConditions, compareTenDayForecast, typeSelected } = this.props
        const compare = typeSelected === 'Current Conditions' ? compareCurrentConditions : compareTenDayForecast
        compare(parseInt(start), parseInt(end))
    }

    renderButtons() {
        const buttons = ['Current Conditions', 'Ten Day Forecast']

        return buttons.map(btn => {
            const { typeSelected, selectWeatherType} = this.props
            const action = name => () => selectWeatherType(name)

            return (
                <button
                    key={btn}
                    className={`ui button ${typeSelected === btn ? 'primary' : ''}`}
                    onClick={action(btn)}>
                    {btn}
                </button>
            )
        })
    }

    render() {
        return (
            <div className="weather-compare">
                <div>
                    {this.renderButtons()}
                </div>

                <h3>Enter Zipcode</h3>
                
                <WeatherForm 
                    onSubmit={this.onSubmit} 
                    isFetching={this.props.isFetching}/>
            </div>
        )
    }
}

const loadingSelector = createLoadingSelector([
    'GET_ZIP', 
    'GET_CAROUSEL_CURRENT',
    'GET_CAROUSEL_FORECAST',
    'GET_WEATHER_CURRENT',
    'GET_WEATHER_FORECAST'
])

const mapStateToProps = (state) => ({
    typeSelected: state.options.typeSelected,
    isFetching: loadingSelector(state) 
})

export default connect(
    mapStateToProps, 
    {
        selectWeatherType, 
        compareCurrentConditions, 
        compareTenDayForecast 
    }
)(WeatherCompare)
