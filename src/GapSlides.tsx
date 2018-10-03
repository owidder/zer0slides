import * as React from 'react';
import {HtmlSlide} from './HtmlSlide';

export class GapSlides extends React.Component {
    public render() {
        return (
            <div>
                <HtmlSlide pathToHtml={"slides/test.html"} name={"test"}/>
            </div>
        );
    }
}
