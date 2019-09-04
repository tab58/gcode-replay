import React from 'react';
import ReactDOM from 'react-dom';
import { disableBodyScroll } from 'body-scroll-lock';

import { App } from './react/app';

// fix to single page
disableBodyScroll(document.querySelector('body'));

ReactDOM.render(<App />, document.querySelector('#wrapper'));