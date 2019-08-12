import React from 'react';
import { createGlobalStyle } from 'styled-components';

import { RowPanel } from './rowPanel';
import { CodePlayerBox } from './codePlayerBox';

const GlobalStyles = createGlobalStyle`
  html, body, #wrapper {
    width: 100%;
    height: 100%;
    padding: 0px;
    margin: 0px;
  }

  body {
    @import url('https://fonts.googleapis.com/css?family=Inconsolata');
  }

  #wrapper {
    position: absolute;
    top: 0px;
    left: 0px;
    background: #20262E;
  }
`;

interface AppState {
  width: number;
  height: number;
}

export class App extends React.Component<{}, AppState> {
  public constructor (props: any) {
    super(props);
    window.addEventListener('resize', this._onWindowResize.bind(this));
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  private _onWindowResize (): void {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  public render (): React.ReactElement {
    return (
      <React.Fragment>
        <GlobalStyles />
        <RowPanel
          initialColSizes={[0.3, 0.7]}
          slider={{
            color: '#605D7B'
          }}
        >
          <CodePlayerBox initialText={'Drag and drop NC code here.'}/>
          <div>Column 2</div>
        </RowPanel>
      </React.Fragment>
    );
  }
}