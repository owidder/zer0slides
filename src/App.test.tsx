import * as React from 'react';
import * as ReactDOM from 'react-dom';
import GapSlides from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<GapSlides />, div);
  ReactDOM.unmountComponentAtNode(div);
});
