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
        this.src = STATIC_IMAGES_URL+filename;
    }
}

class VideoData{
    filename;
    constructor({filename, maxFrame}){
        const file = filename.split('.')
        this.filename = file[0];
        this.extension = file[1];
        this.src =  STATIC_VIDEOS_URL+filename;
        this.introSrc = STATIC_VIDEOS_URL+filename.split('.')[0]+".jpg";
        //this.frameCount = frameCount;

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

    // 둘중 하나 고르기

    addImage_(file){
        this.images.push(new ImageData(file))
    }
    addVideo_(file){
        this.videos.push(new VideoData(file))
    }

    addImage(image){
        const img = new Image()
        img.src = image
        this.images.push(img)
    }

    addVideo(video){
        const data = document.createElement('video')
        data.src = video
        this.videos.push(data)
    }
}
