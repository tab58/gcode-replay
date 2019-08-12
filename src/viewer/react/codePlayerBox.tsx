import React, { ReactElement, useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';

// Codemirror JS files
import 'codemirror/lib/codemirror.js';
import 'codemirror/addon/selection/active-line.js';

// Codemirror CSS files
import 'codemirror/lib/codemirror.css';
import '../css/codemirror.css';

interface CodeMirrorBoxProps {
  initialText: string;
}

export function CodePlayerBox (props: CodeMirrorBoxProps): ReactElement {
  const [text, setText] = useState(props.initialText);

  return <CodeMirror
    value={text}
    options={{
      lineNumbers: true,
      dragDrop: true,
      readOnly: true,
      styleActiveLine: true,
      tabSize: 2,
      cursorHeight: 0.85
    } as any}
    onBeforeChange={(editor, data, value): void => {
    }}
  />;
}