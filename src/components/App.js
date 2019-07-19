import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import Header from './Header'
import WeatherCompare from './Weather/WeatherCompare'
import WeatherCurrent from './Weather/WeatherCurrent'
import WeatherForecast from './Weather/WeatherForecast'
import history from '../history'

const App = () => {
    return (
        <div className="ui container">
            <Router history={history}>
                <Header />
                <Switch>
                    <Route path="/" exact component={WeatherCompare} />
                    <Route path="/weather/current" exact component={WeatherCurrent} />
                    <Route path="/weather/forecast" exact component={WeatherForecast} />
                </Switch>
            </Router>
        </div>
    )
}

export default App