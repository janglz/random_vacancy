import React from "react";
import spinner from './loader.svg';

export default class Spinner extends React.Component {
    render() {
        return (
            <div className="loader-container">
                <img src={spinner} className="loader-img" alt="logo" />
            </div>
        )
    }
}