import {
    useState,
    useRef
} from 'react';
import { observer } from 'mobx-react';

import { useStores } from '../states/Context';
import styles from '../static/css/Tool.module.css';

import ElementTree from './ElementTree';

import sectionImg from '../static/images/section.svg';
import textImg from '../static/images/text.svg';
import buttonImg from '../static/images/button.svg';
import imageImg from '../static/images/image.svg';
import videoImg from '../static/images/video.svg';
import filesImg from '../static/images/files.svg';
import plusImg from '../static/images/plus.svg';
import elementImg from '../static/images/element.svg';
import {
    addAssetImage,
    addAssetVideo,
} from '../api';




export const Assets = observer(({ tab, changeTab, clickEvent }) => {
    const { elementStore, assetStore, userStore } = useStores();
    const fileInputRef = useRef(null)

    const selectImage = () => {
        fileInputRef.current.click();
    }
    const addImage = async (e) => {
        const form = new FormData()
        form.append('image', fileInputRef.current.files[0])
        const res = await addAssetImage(userStore.id, userStore.project_id, form)
        assetStore.addImage(res.data)
    }

    const addVideo = async (e) => {
        const form = new FormData()
        form.append('video', fileInputRef.current.files[0])
        const  res = await addAssetVideo(userStore.id, userStore.project_id, form)
        console.log(res)
        assetStore.addVideo(res.data)
    }

    const addAsset = (type) => {
        const f = document.createElement('input')
        f.type = 'file'
        f.addEventListener('change', (e) => {
            const file = e.target.files[0]
            const fileReader = new FileReader()
            if (file.type.match(type.slice(0, 5))) {
                fileReader.onload = () => {
                    if(type === 'images')
                        assetStore.addImage(fileReader.result)
                    else
                        assetStore.addVideo(fileReader.result)
                }
                fileReader.readAsDataURL(file)
            }
        })
        f.click()
    }

    return (
        <div className={styles.assetsContainer}>
            {changeTab ?
                <div className={styles.tabContainer}>
                    <button className={tab === "images" ? styles.selectedTab : ""}
                        onClick={() => changeTab('images')}>images</button>
                    <button className={tab === "videos" ? styles.selectedTab : ""}
                        onClick={() => changeTab('videos')}>videos</button>
                </div> :
                <></>
            }
            <div className={styles.contentsContainer}>
                <button className={styles.addAssetButton}
                    onClick={() => addAsset(tab)}>
                    +
                </button>
                {tab === "images" ?
                    <>
                        <input type="file"
                            ref={fileInputRef}
                            className={styles.imageInput}
                            onChange={addImage} />
                        <button className={styles.addAsset}
                            onClick={selectImage}>
                            +
                        </button>
                        {
                            assetStore.images.map((image, index) => {
                                return (
                                    <button key={"image_" + index}>
                                        <img src={image.src}
                                            alt={"image_" + index}
                                            onClick={clickEvent ?
                                                () => clickEvent(image) :
                                                () => elementStore.add({
                                                    tag: 'image',
                                                    src: image.src,
                                                })} />
                                    </button>
                                )
                            })
                        }
                    </> : ""}

                {tab === "videos" ?
                    <>
                        <input type="file"
                            ref={fileInputRef}
                            className={styles.imageInput}
                            onChange={addVideo} />
                        <button className={styles.addAsset}
                            onClick={selectImage}>
                            +
                        </button>
                        {assetStore.videos.map((video, index) => {
                            return (
                                <button key={"video_" + index}>
                                    <img src={video.introSrc}
                                        alt={"video_" + index}
                                        onClick={() => elementStore.add({
                                            tag: 'video',
                                            src: video.src,
                                            introSrc: video.introSrc,
                                            frameCount: video.frameCount,
                                        })} />
                                </button>
                            )
                        })}
                    </> : ""}
            </div>
        </div>
    )

})



export default observer(() => {

    const { elementStore, stageStore } = useStores();
    const [ExpansionTool, setExpansionTool] = useState('ElementTree')
    const [assetsTab, setAssetsTab] = useState('images');


    const toggleExpansion = (expansion, tab) => {
        const expansionToolContainer = document.body.querySelector('#expansion-tool-9999');
        // 열려있지 않다면
        if (!expansionToolContainer.classList.contains(styles.opened)) {
            setExpansionTool(expansion);
            expansionToolContainer.classList.toggle(styles.opened);
        }
        // 열려있다면
        else {
            if (ExpansionTool === expansion) {
                if (expansion === "Assets" && tab && tab !== assetsTab)
                    setAssetsTab(tab);
                else
                    expansionToolContainer.classList.toggle(styles.opened);
            } else {
                setExpansionTool(expansion);
            }
        }

        if (tab) {
            setAssetsTab(tab);
        }
    }

    const defaultStyles = {
        style: {
            position: 'absolute',
            left: stageStore.width / 2,
            top: stageStore.height / 2 + stageStore.scrollTop
        }
    }


    return (
        <div className={styles.toolContainer}>
            <div className={styles.defaultToolContainer}>
                <div>
                    <button role="menuitem" onClick={() => elementStore.add({ tag: 'section', ...defaultStyles })}><img src={sectionImg} alt="add section" /></button>
                    <button onClick={() => elementStore.add({ tag: 'text', ...defaultStyles })}><img src={textImg} alt="add text" /></button>
                    <button onClick={() => elementStore.add({ tag: 'button', ...defaultStyles })}><img src={buttonImg} alt="add button" /></button>
                    <button onClick={() => toggleExpansion("Assets", "images")}><img src={imageImg} alt="open assets images" /></button>
                    <button onClick={() => toggleExpansion("Assets", "videos")}><img src={videoImg} alt="open assets videos" /></button>
                    <button onClick={() => elementStore.add({ tag: 'text' })} ><img src={plusImg} alt="" /></button>
                </div>


                <div>
                    <button onClick={() => toggleExpansion("ElementTree")}><img src={elementImg} alt="" /></button>
                    <button onClick={() => toggleExpansion("Assets")}><img src={filesImg} alt="" /></button>

                </div>
            </div>

            <div id="expansion-tool-9999" className={styles.expansionToolContainer}>
                {ExpansionTool === "ElementTree" && <ElementTree />}
                {ExpansionTool === "Assets" &&
                    <Assets tab={assetsTab} changeTab={setAssetsTab} />}
            </div>

        </div>
    )
})