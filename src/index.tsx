import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {GapSlides} from './GapSlides';

import {slidAR} from './slidarClassic/slidAR';

(window as any).slidAR = slidAR;

ReactDOM.render(
    <GapSlides/>,
    document.getElementById('root') as HTMLElement
);
