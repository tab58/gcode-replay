import minimist from 'minimist';
import { resolve } from 'path';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';

import { parseLine } from './rs274/parser/parser';

const argv = minimist(process.argv.slice(2));
const argFilepath = argv._[0];
const filepath = resolve(__dirname, argFilepath);

if (filepath) {
  (async function (): Promise<void> {
    let lineNumber = 0;
    const readInterface = createInterface(createReadStream(filepath));
    for await (const line of readInterface) {
      lineNumber++;
      try {
        if (lineNumber === 12) {
          console.log(line);
          const parsed = parseLine(line, lineNumber);
          console.log(JSON.stringify(parsed, null, 2));
        }
      } catch (err) {
        console.error(err);
      }
    }
  })();
} else {
  console.log('Please specify the G-code filename.');
}