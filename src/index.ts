import minimist from 'minimist';
import { resolve } from 'path';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';

import { parse, RS274Interpreter } from './replayer/gcode-rs274';

const argv = minimist(process.argv.slice(2));
const argFilepath = argv._[0];
const filepath = resolve(__dirname, argFilepath);

if (filepath) {
  (async function (): Promise<void> {
    let lineNumber = 0;
    const readInterface = createInterface(createReadStream(filepath));
    const interpreter = new RS274Interpreter();
    for await (const line of readInterface) {
      lineNumber++;
      try {
        if (lineNumber <= 12) {
          const cmdIterator = parse(line, interpreter);
          console.log(line);
          for await (const command of cmdIterator) {
            console.log(JSON.stringify(command, null, 2));
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  })();
} else {
  console.log('Please specify the G-code filename.');
}