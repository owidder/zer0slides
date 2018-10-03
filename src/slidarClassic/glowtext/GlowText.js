import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import './GlowText.css';

const renderLines = (lines, classNames = "") => {
    return lines.map((line, i) => {
        return (
            <span key={"glow-line-" + i}>
                <span className={classNames}>{line}</span>
                <br/>
            </span>
        )
    })
}

class GlowText extends Component {

    render() {
        return (
            <div className="GlowText">
                {renderLines(this.props.lines, this.props.classNames)}
            </div>
        )
    }
}

GlowText.propTypes = {
    text: PropTypes.string,
    lines: PropTypes.array,
    classNames: PropTypes.string
}

const create = (selector, lines, classNames) => {
    ReactDOM.render(<GlowText lines={lines} classNames={classNames}/>, document.querySelector(selector));
}

export const glowText = {
    create
}
