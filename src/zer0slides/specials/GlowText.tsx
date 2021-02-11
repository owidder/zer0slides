import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {q} from "../selector/selector";

import './GlowText.css';

interface GlowTextProps {
    lines: string[];
    classNames: string;
}

const renderLines = (lines: string[], classNames = "") => {
    return lines.map((line, i) => {
        return (
            <span key={"glow-line-" + i}>
                <span className={classNames}>{line}</span>
                <br/>
            </span>
        )
    })
}

class GlowText extends React.Component<GlowTextProps> {

    public render() {
        return (
            <div className="GlowText">
                {renderLines(this.props.lines, this.props.classNames)}
            </div>
        )
    }
}

const _waitForSelectorRecursive = (selector: string, resolve: () => void) => {
    if(!document.querySelector(q(selector))) {
        setTimeout(() => {_waitForSelectorRecursive(selector, resolve)}, 100);
    }
    else {
        resolve();
    }
}

const waitForSelector = (selector: string) => {
    return new Promise<void>(resolve => {
        _waitForSelectorRecursive(selector, resolve);
    })
}

const create = (selector: string, lines: string[], classNames: string) => {
    waitForSelector(selector).then(() => {
        ReactDOM.render(<GlowText lines={lines} classNames={classNames}/>, document.querySelector(q(selector)));
    })
}

export const glowText = {
    create
}
