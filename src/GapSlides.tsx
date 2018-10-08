import * as React from 'react';
import {HtmlSlide} from './slidar2/html/HtmlSlide';
import {Slide} from './slidar2/core/Slide';

interface GapSlidesProps {
    slide: Slide
}

export class GapSlides extends React.Component<GapSlidesProps> {

    public render() {
        return (
            <div>
                <HtmlSlide pathToHtml={this.props.slide.getPathToHtml()} name={this.props.slide.name}/>
            </div>
        );
    }
}
