import { CommandBlock } from '../gcode-rs274/src/interpreter/types';

export { CommandBlock } from '../gcode-rs274/src/interpreter/types';

export interface MachineStatePlugin {
  activate: (c: CommandBlock) => boolean;
  getState: () => { [key: string]:  any };
}