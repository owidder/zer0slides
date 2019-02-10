import * as React from 'react';

import {slideCore} from '../core/core';

interface ContentSlideProps {
    slideName: string;
}

export class ContentSlide extends React.Component<ContentSlideProps> {

    constructor(props: ContentSlideProps) {
        super(props);
    }

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
        return <div id={this.props.slideName}>
            <div className="_0_content"></div>
        </div>
    }
}
