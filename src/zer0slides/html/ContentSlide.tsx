import * as React from 'react';

import {slideCore} from '../core/core';

export class ContentSlide extends React.Component {

    private createSlideNamesString() {
        return slideCore.getSlideNames().reduce((slideNamesString, slideName) => {
            const line = `${slideName}();`;
            return slideNamesString.length > 0 ? `${slideNamesString}\n${line}` : line;
        }, "")
    }

    public componentDidMount() {
        const slideNamesString = this.createSlideNamesString();
        slideCore._0.codeJs("._0_content", slideNamesString);
    }

    public render() {
        return <div className="_0_content"></div>
    }
}
