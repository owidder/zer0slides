import * as React from 'react';
import {HtmlSlide} from './slidar2/html/HtmlSlide';
import {pathToHtml} from './slidar2/html/pathToHtml';

interface GapSlidesProps {
    slideName: string
}

export class GapSlides extends React.Component<GapSlidesProps> {
    constructor(props: GapSlidesProps) {
        super(props);
        this.state = {}
    }

    public render() {
        const _pathToHtml = pathToHtml(this.props.slideName);

        return (
            <div>
                <HtmlSlide pathToHtml={_pathToHtml} name={"test"}/>
            </div>
        );
    }
}
