import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {GapSlides} from './GapSlides';

import {init} from './initGapslides';

init();

ReactDOM.render(
    <GapSlides/>,
    document.getElementById('root') as HTMLElement
);
