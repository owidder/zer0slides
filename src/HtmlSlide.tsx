import * as React from 'react';
import * as $ from 'jquery';

interface HtmlSlideProps {
    pathToHtml: string,
    name: string,
}

export class HtmlSlide extends React.Component<HtmlSlideProps> {

    private container = React.createRef<HTMLDivElement>();

    public componentDidMount() {
        $(this.container).load(this.props.pathToHtml);
    }

    public render() {
        return (
            <div id={this.props.name} ref={this.container} className="html-slide"></div>
        );
    }
}