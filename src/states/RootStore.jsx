import { ElementStore } from './ElementStore';
import { AssetStore } from './AssetStore';
import { WindowStore } from './WindowStore';
import { StageStore } from './StageStore';
import { UserStore } from './UserStore';

export class RootStore {
    elementStore;
    assetStore;
    windowStore;
    stageStore;
    userStore;
    constructor() {
        this.elementStore = new ElementStore(this);
        this.assetStore = new AssetStore(this);
        this.windowStore = new WindowStore(this);
        this.stageStore = new StageStore(this);
        this.userStore = new UserStore(this);
    }
}