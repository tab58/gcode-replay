interface PanelModelOptions {
  initialSize: number;
}

export class MultiSectionPanelModel {
  private _lastWidth: number;

  public constructor (options: PanelModelOptions) {
    this._lastWidth = -1;
  }
}