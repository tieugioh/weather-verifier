import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import loadingReducer from './loading.reducer'
import carouselReducer from './carousel.reducer'
import weatherReducer from './weather.reducer'
import compareReducer from './compare.reducer'
import optionsReducer from './options.reducer'

export default combineReducers({
    carousel: carouselReducer,
    weather: weatherReducer,
    comps: compareReducer,
    loading: loadingReducer,
    form: formReducer,
    options: optionsReducer
});