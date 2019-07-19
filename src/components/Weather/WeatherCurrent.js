import React from 'react'
import { connect } from 'react-redux'
import WeatherTable from './WeatherTable'

class WeatherCurrent extends React.Component {
    render() {
        const headers = [
            'Zipcode', 'Source', 'Current Temp', 'Feels Like',
            'Wind Speed', 'Wind Direction', 'Sunrise(mins)',
            'Sunset(mins)', 'Humidity', 'Icon(number)', 'Description'
        ]
        
        return (
            <div className="weather-current">
                <h1>Current Conditions</h1>
                <WeatherTable 
                    headers={headers}
                    compList={this.props.compList} />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    compList: state.comps.currentConditions
})

export default connect(
    mapStateToProps, 
    null
)(WeatherCurrent)
