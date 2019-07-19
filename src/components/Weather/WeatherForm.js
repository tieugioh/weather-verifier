import React from 'react'
import { Field, reduxForm } from 'redux-form'

class WeatherForm extends React.Component {
    renderError = ({ error, touched }) => {
        if(touched && error) {
            return (
                <div className="ui error message">
                    <div className="header">{error}</div>
                </div>
            )
        }
    }
    
    renderInput = ({ input, label, meta }) => {
        const className = `field ${meta.error && meta.touched ? 'error': ''}`

        return (
            <div className={className}>
                <label>{label}</label>
                <input {...input} autoComplete="off"/>
                {this.renderError(meta)}
            </div>
        )
    }

    onSubmit = formValues => {
        this.props.onSubmit(formValues)
    }

    render() {
        const className = `ui form ${this.props.isFetching ? 'loading' : ''} error`

        return (
            <form 
                onSubmit={this.props.handleSubmit(this.onSubmit)} 
                className={className}>
                
                <Field 
                    name="start" 
                    component={this.renderInput} 
                    label="Enter Starting Zipcode" />
                <Field 
                    name="end" 
                    component={this.renderInput} 
                    label="Enter Ending Zipcode" />
                <button className="ui button primary">Submit</button>
            </form>
        )
    }
}

const validate = formValues => {
    const errors = {}
    const start = formValues.start
    const end = formValues.end
    
    if(!start)
        errors.start = 'You must enter a starting zipcode'    
    else if (isNaN(start) )
        errors.start = 'You must enter a valid zipcode'
    else if (start.length !== 5)
        errors.start = 'Zipcode must be 5 digits long'

    if(!end)
        errors.end = 'You must enter an ending zipcode'
    else if (isNaN(end))
        errors.end = 'You must enter a valid zipcode'
    else if(end.length !== 5)
        errors.end = 'Zipcode must be 5 digits long'
    else if(end < start)
        errors.end = 'Ending zipcode must be greater than ending zipcode'
    else if(end - start > 500)
        errors.end = 'Range too large, must be within 500 zipcodes'
        
    return errors
}

export default reduxForm({
    form: 'weatherForm',
    validate
})(WeatherForm)