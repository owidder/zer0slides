import * as React from 'react';

interface HtmlSlideProps {
    pathToHtml: string,
}

export class HtmlSlide extends React.Component<HtmlSlideProps> {

    public render() {
        return (
            <div className="html-slide"></div>
        );
    }
}