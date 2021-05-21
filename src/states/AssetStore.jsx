import { makeObservable, observable } from "mobx";

const imageURL = '../assets/images/';
const videoURL = '../assets/videos/';

class ImageData{
    filename;
    constructor(filename){
        const file = filename.split('.')
        this.filename = file[0];
        this.extension = file[1];
        this.src = imageURL+filename;
    }
}

class VideoData{
    filename;
    constructor(filename, frameCount){
        const file = filename.split('.')
        this.filename = file[0];
        this.extension = file[1];
        this.src =  videoURL+filename;
        this.introSrc = videoURL+filename.split('.')[0]+".jpg";
        this.frameCount = frameCount;

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
        });

        this.images = [
            new ImageData('1.jpg'),
            new ImageData('2.jpg'),
            new ImageData('3.jpg'),
            new ImageData('4.jpg'),
            new ImageData('5.jpg'),
            new ImageData('6.png'),
            new ImageData('7.jpg'),
            new ImageData('8.jpg'),
            new ImageData('9.jpg'),
            new ImageData('10.jpg'),
            new ImageData('apple.png'),
            new ImageData('apple_image_1.jpg'),
            new ImageData('apple_image_2.jpg'),
            new ImageData('apple_image_3.jpg'),
            new ImageData('apple_image_4.jpg'),
            new ImageData('apple_image_5.jpg'),
            new ImageData('apple_footer1.jpg'),
        ]
        this.videos = [
            new VideoData('1.mp4'),
            new VideoData('2.mp4'),
            new VideoData('3.mp4'),
            new VideoData('apple1.mp4'),
            new VideoData('apple2.mp4', 119),
            new VideoData('apple3.mp4', 155),
            new VideoData('apple4.mp4', 131),
            new VideoData('apple5.mp4', 149),
            new VideoData('apple6.mp4', 14),
        ]
    


        this.rootStore = root;

    }
}