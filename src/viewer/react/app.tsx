import React from 'react';
import { createGlobalStyle } from 'styled-components';

import { MultiSectionPanel } from './components/panel/panel';
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
        <MultiSectionPanel
          direction={'row'}
          initialSectionSizes={[0.4, 0.6]}
          slider={{
            color: '#605D7B'
          }}
        >
          <CodePlayerBox initialText={'Drag and drop NC code here.\nRight here.\nA\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\nM\nN\nO\nP'}/>
          <MultiSectionPanel
            direction={'column'}
            slider={{
              color: '#605D7B'
            }}
          >
            <div>Panel 2</div>
            <div>Panel 3</div>
          </MultiSectionPanel>
        </MultiSectionPanel>
      </React.Fragment>
    );
  }
}
/*
<MultiSectionPanel
            direction={'column'}
            slider={{
              color: '#605D7B'
            }}
          >
            <div>Panel 2</div>
            <div>Panel 3</div>
          </MultiSectionPanel>
*/