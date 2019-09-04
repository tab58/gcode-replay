import React, { ReactElement, useState, useCallback } from 'react';
// import { UnControlled as CodeMirror } from 'react-codemirror2';
import CodeMirror from 'codemirror';

// Codemirror JS files
import 'codemirror/lib/codemirror.js';
import 'codemirror/addon/selection/active-line.js';

// Codemirror CSS files
import 'codemirror/lib/codemirror.css';
import '../css/codemirror.css';

interface CodeMirrorBoxProps {
  initialText: string;
}

const readFileContents = async function (file: File): Promise<string> {
  return new Promise((resolve, reject): void => {
    const reader = new FileReader();
    reader.onload = (): any => {
      resolve(reader.result as string);
    };
    reader.onabort = (e: ProgressEvent): void => {
      reject(e);
    };
    reader.onabort = (e: ProgressEvent): void => {
      reject(e);
    };
    reader.readAsText(file, 'utf8');
  });
};

export function CodePlayerBox (props: CodeMirrorBoxProps): ReactElement {
  const [ boxState, setBoxState ] = useState({
    cm: CodeMirror,
    editor: null,
    text: props.initialText
  });

  const refCallback = useCallback((el: HTMLTextAreaElement): void => {
    const editor = boxState.cm.fromTextArea(el, {
      lineNumbers: true,
      dragDrop: true,
      readOnly: true,
      styleActiveLine: true,
      tabSize: 2,
      cursorHeight: 0.85
    } as any);
    editor.focus();
    editor.setValue(boxState.text);
    editor.setSize('100%', '100%');
    editor.on('drop', async (_: CodeMirror.Editor, e: DragEvent): Promise<void> => {
      const files = e.dataTransfer.files;
      if (files.length === 1) {
        const file = files[0];
        const fileText = await readFileContents(file);
        setBoxState({ text: fileText, editor: boxState.editor, cm: boxState.cm });
        editor.setValue(fileText);
      }
    });
    window.setTimeout((): void => { editor.refresh(); });
  }, [boxState]);

  return <textarea ref={refCallback}></textarea>;
}