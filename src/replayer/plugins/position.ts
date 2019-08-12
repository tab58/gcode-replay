import { CommandBlock, MachineStatePlugin } from './plugin';

const positionGCodes = [0, 1, 2, 3, 38.2, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89];

export interface Position {
  x: number;
  y: number;
  z: number;
  a: number;
  b: number;
  c: number;
}

export class PositionPlugin implements MachineStatePlugin {


  public activate (block: CommandBlock): boolean {
    const { command } = block;
    return positionGCodes.includes(command.value);
  }

  public getState (): any {

  }

  public constructor () {}
}