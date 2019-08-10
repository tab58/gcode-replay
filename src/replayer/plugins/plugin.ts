import { CommandBlock } from '../rs274/interpreter/types';

export { CommandBlock } from '../rs274/interpreter/types';

export interface MachineStatePlugin {
  activate: (c: CommandBlock) => boolean;
  getState: () => { [key: string]:  any };
}