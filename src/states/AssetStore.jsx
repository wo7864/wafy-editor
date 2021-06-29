import {
    makeObservable, 
    observable,
    action,
} from "mobx";
import {
    STATIC_IMAGES_URL,
    STATIC_VIDEOS_URL
} from '../util/constant'


class ImageData{
    filename;
    constructor(filename){
        const file = filename.split('.')
        this.filename = file[0];
        this.extension = file[1];
        this.src = `${STATIC_IMAGES_URL}/${filename}`;
    }
}

class VideoData{
    filename;
    constructor({filename, maxFrame}){
        const file = filename.split('.')
        this.filename = file[0];
        this.extension = file[1];
        this.src =  `${STATIC_VIDEOS_URL}/${filename}`;
        this.introSrc = `${STATIC_VIDEOS_URL}/thumbnail/${filename.split('.')[0]}.jpg`;
        this.frameCount = maxFrame;
    }
}


export class AssetStore {
    rootStore;
    images = [];
    videos = [];
    constructor(root) {
        makeObservable(this, {
            images:observable,
            videos:observable,
            initImages:action,
            initVideos:action,
            addImage:action,
            addVideo:action,
        });

        this.images = []
        this.videos = []
        this.rootStore = root;
    }
    initImages(){
        this.images = []
    }

    initVideos(){
        this.videos = []
    }

    addImage(file){
        this.images.push(new ImageData(file))
    }
    addVideo(file){
        this.videos.push(new VideoData(file))
    }
}