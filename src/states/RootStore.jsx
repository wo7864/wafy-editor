import { ElementStore } from './ElementStore';
import { AssetStore } from './AssetStore';
import { WindowStore } from './WindowStore';
import { StageStore } from './StageStore';

export class RootStore {
    elementStore;
    assetStore;
    windowStore;
    stageStore;
    constructor() {
        this.elementStore = new ElementStore(this);
        this.assetStore = new AssetStore(this);
        this.windowStore = new WindowStore(this);
        this.stageStore = new StageStore(this);
    }
}