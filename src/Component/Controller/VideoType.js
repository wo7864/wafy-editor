import { observer } from 'mobx-react';

import { useStores } from '../../states/Context';
import { splitVideo } from '../../api';

import styles from '../../static/css/Controller.module.css';

import { IoPlaySkipForwardSharp } from "react-icons/io5";
import { SiVlcmediaplayer } from "react-icons/si";


export default observer(({ elementStore }) => {
    const {userStore} = useStores()
    const element = elementStore.selectedElem;


    const scrollType = async () => {
        if(element.frameCount === -1){
            const path = element.src.split('/');
            const filename = path[path.length-1]
            const res = await splitVideo(userStore.id, userStore.project_id, filename)
            element.setProperty('frameCount', res.data.cnt)
        }
        element.setProperty('videoType', 'scroll')

    }

    return (
        <div className={styles.optionRows}>
            <span>비디오 타입</span>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <button className={element.videoType === "normal" ? styles.selected : ""}
                        onClick={() => element.setProperty('videoType', 'normal')}><IoPlaySkipForwardSharp /></button>
                    <button className={element.videoType === "scroll" ? styles.selected : ""}
                        onClick={scrollType}><SiVlcmediaplayer /></button>
                </div>
                {element.videoType === 'scroll' &&
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(2, 1fr)` }}>
                        <span>start</span>
                        <input type="text" className={styles.smallInput}
                            value={element.scrollStart}
                            onChange={(e) => element.setProperty('scrollStart', e.target.value)} />
                        <span>end</span>
                        <input type="text" className={styles.smallInput}
                            value={element.scrollEnd}
                            onChange={(e) => element.setProperty('scrollEnd', e.target.value)} />
                    </div>
                }

            </div>

        </div>
    )
})
