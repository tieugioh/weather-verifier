import React from 'react'

class WeatherTable extends React.Component {
    renderHeaders() {
        const { headers } = this.props
        return headers.map(header => <th key={header}>{header}</th>)
    }

    renderRow(data, zipcode) {
        let renderList = []

        for(let key in data) {
            const id = `${zipcode}${data.source}${key}`
            renderList.push(<td key={id}>{data[key]}</td>)
        }

        return renderList
    }

    renderTable() {
        return this.props.compList.map(comp => {
            const { zipcode, carousel, weatherChannel } = comp

            return (
                <React.Fragment key={zipcode}>
                    <tr>
                        <td rowSpan="2">{zipcode}</td>
                        {this.renderRow(carousel, zipcode)}
                    </tr>
                    <tr>
                        {this.renderRow(weatherChannel, zipcode)}
                    </tr>
                </React.Fragment>
            )
        })
    }

    render() {
        if(this.props.compList.length === 0)
            return <h1>No Discrepanies</h1>

        return (
            <table className="ui celled structured table">
                <thead>
                    <tr>
                        {this.renderHeaders()}
                    </tr>
                </thead>
                <tbody>
                    {this.renderTable()}
                </tbody>
            </table>
        )
    }
}

export default WeatherTable
