import React from "react";

class SelectCity extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        const city = this.props.cities.find(el => el.code === e.target.value)
        this.props.onHandleClick(city)
    }

    render() {
        const citiesList = this.props.cities.map((city) => {
            return <option key={city.code} value={city.code}>{city.name}</option>
        })

        return (
            <form className="form inline" onSubmit={(e)=> e.preventDefault()}>
                <label>
                    <select className="no-border select" value={this.props.city.code} onChange={this.handleChange} >
                    {citiesList} 
                    </select>
                </label>
            </form>
        )
    }
}

export default SelectCity;