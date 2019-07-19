import React from 'react'
import { connect } from 'react-redux'
import WeatherTable from './WeatherTable'

class WeatherForeCast extends React.Component { 
    render() {
        const headers = [
            'Zipcode', 'Source', 'Day One Hi', 'Day One Lo', 'Day Two Hi', 
            'Day Two Lo', 'Day Three Hi', 'Day Three Lo', 'Day Four Hi', 
            'Day Four Lo', 'Day Five Hi', 'Day Five Lo', 'Day Six Hi', 
            'Day Six Lo', 'Day Seven Hi', 'Day Seven Lo', 'Day Eight Hi', 
            'Day Eight Lo', 'Day Nine Hi', 'Day Nine Lo', 'Day Ten Hi', 
            'Day Ten Lo'
        ]

        return (
            <div className="weather-forecast">
                <h1>Ten Day Forecast</h1>
                <WeatherTable 
                    headers={headers}
                    compList={this.props.compList} />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    compList: state.comps.forecast
})

export default connect(
    mapStateToProps, 
    null
)(WeatherForeCast)