import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { loadWeatherStationIDs } from '../actions'

class Header extends React.Component {
    componentDidMount() {
        this.props.loadWeatherStationIDs()
    }

    render() {
        return (
            <div className="ui secondary pointing menu">
                <Link to="/" className="item">
                    Home
                </Link>
                <div className="right menu">
                    <Link to="/weather/current" className="item">
                        Current Conditions
                    </Link>
                    <Link to="/weather/forecast" className="item">
                        Ten Day Forecast
                    </Link>
                </div>
            </div>

        )
    }
}

export default connect(
    null,
    { loadWeatherStationIDs }
)(Header)