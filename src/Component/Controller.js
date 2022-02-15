import { useState } from 'react';

import { useStores } from '../states/Context';
import { observer } from 'mobx-react';
import ControlAnimation from './ControlAnimation'
import {
    BsBoundingBoxCircles,
    BsSubtract,
    BsCollectionPlay,
} from "react-icons/bs";


import IdController from './Controller/Id'
import BackdropFilterController from './Controller/BackdropFilter'
import BackgroundColorController from './Controller/BackgroundColor'
import BorderController from './Controller/Border'
import ColorController from './Controller/Color'
import FlexController from './Controller/Flex'
import FontFamilyController from './Controller/FontFamily'
import FontStyleController from './Controller/FontStyle'
import PositionController from './Controller/Position'
import RectController from './Controller/Rect'
import ShadowController from './Controller/Shadow'
import TextAlignController from './Controller/TextAlign'
import VideoTypeController from './Controller/VideoType'


import styles from '../static/css/Controller.module.css';


/*
const OpacityController = observer(({ elementStore }) => {
    const element = elementStore.selectedElem;

    return (
        <div className={styles.optionRows}>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span>불투명도</span>
                <span>{element.style.opacity.toFixed(1)}</span>

            </div>
            <input type="range" value={element.style.opacity}
                max={1} min={0} step={0.1}
                onChange={(e) => elementStore.updateStyle(element, { opacity: parseFloat(e.target.value) })} />

        </div>
    )
})
*/



const TabContainer = ({ tabState, changeTab }) => {
    return (
        <div className={styles.tabContainer}>
            <button className={tabState === "common" ? styles.selectedTab : ""} onClick={() => changeTab("common")}><BsBoundingBoxCircles /></button>
            <button className={tabState === "advanced" ? styles.selectedTab : ""} onClick={() => changeTab("advanced")}><BsSubtract /></button>
            <button className={tabState === "animation" ? styles.selectedTab : ""} onClick={() => changeTab("animation")}><BsCollectionPlay /></button>
        </div>
    )
}


/******* 각 Element Tag 별 컨트롤러 */

const SectionController = observer(({ elementStore }) => {
    const [tabState, changeTab] = useState("common")
    return (
        <div className={styles.optionContainer}>
            <IdController elementStore={elementStore} />
            <TabContainer tabState={tabState} changeTab={changeTab} />
            {tabState === "common" &&
                <>
                    <RectController elementStore={elementStore} />
                    <PositionController elementStore={elementStore} />
                    <FlexController elementStore={elementStore} />
                    <BackgroundColorController elementStore={elementStore} />
                    <BorderController elementStore={elementStore} />
                </>
            }
            {tabState === "advanced" &&
                <>
                    <ShadowController elementStore={elementStore} />
                    <BackdropFilterController elementStore={elementStore} />

                </>}
            {tabState === "animation" &&

                <>
                    <ControlAnimation />
                </>
            }
        </div>
    )

})


const TextController = observer(({ elementStore }) => {
    const [tabState, changeTab] = useState("common")

    return (
        <div className={styles.optionContainer}>
            <TabContainer tabState={tabState} changeTab={changeTab} />


            {tabState === "common" &&
                <>
                    <IdController elementStore={elementStore} />
                    <RectController elementStore={elementStore} />
                    <PositionController elementStore={elementStore} />
                    <TextAlignController elementStore={elementStore} />
                    <FontFamilyController elementStore={elementStore} />
                    <FontStyleController elementStore={elementStore} />
                    <ColorController elementStore={elementStore} />
                </>
            }
            {tabState === "animation" &&

                <>
                    <ControlAnimation />
                </>
            }
        </div>
    )
})


const ButtonController = observer(({ elementStore }) => {

    const [tabState, changeTab] = useState("common")
    return (
        <div className={styles.optionContainer}>
            <IdController elementStore={elementStore} />
            <TabContainer tabState={tabState} changeTab={changeTab} />

            {tabState === "common" &&
                <>
                    <RectController elementStore={elementStore} />
                    <PositionController elementStore={elementStore} />
                    <FlexController elementStore={elementStore} />
                    <FontFamilyController elementStore={elementStore} />
                    <FontStyleController elementStore={elementStore} />
                    <ColorController elementStore={elementStore} />
                    <BackgroundColorController elementStore={elementStore} />
                    <BorderController elementStore={elementStore} />
                </>
            }
            {tabState === "advanced" &&
                <>
                    <ShadowController elementStore={elementStore} />

                </>}
            {tabState === "animation" &&

                <>
                    <ControlAnimation />
                </>
            }
        </div>
    )
})


const ImageController = observer(({ elementStore }) => {

    const [tabState, changeTab] = useState("common")
    return (
        <div className={styles.optionContainer}>
            <IdController elementStore={elementStore} />
            <TabContainer tabState={tabState} changeTab={changeTab} />

            {tabState === "common" &&
                <>
                    <RectController elementStore={elementStore} />
                    <PositionController elementStore={elementStore} />
                    <BorderController elementStore={elementStore} />
                </>
            }
            {tabState === "advanced" &&
                <>
                    <ShadowController elementStore={elementStore} />

                </>}
            {tabState === "animation" &&

                <>
                    <ControlAnimation />
                </>
            }
        </div>
    )
})


const VideoController = observer(({ elementStore }) => {

    const [tabState, changeTab] = useState("common")
    return (
        <div className={styles.optionContainer}>
            <IdController elementStore={elementStore} />
            <TabContainer tabState={tabState} changeTab={changeTab} />

            {tabState === "common" &&
                <>
                    <RectController elementStore={elementStore} />
                    <VideoTypeController elementStore={elementStore} />
                    <PositionController elementStore={elementStore} />
                    <BorderController elementStore={elementStore} />
                </>
            }
            {tabState === "advanced" &&
                <>
                    <ShadowController elementStore={elementStore} />

                </>}
            {tabState === "animation" &&

                <>
                    <ControlAnimation />
                </>
            }
        </div>
    )
})

export default observer(() => {
    const { elementStore } = useStores();

    return (
        <div className={styles.container}>

            {elementStore.selectedElem ?
                <>
                    {elementStore.selectedElem.tag === "section" &&
                        <SectionController elementStore={elementStore} />}
                    {elementStore.selectedElem.tag === "text" &&
                        <TextController elementStore={elementStore} />}
                    {elementStore.selectedElem.tag === "button" &&
                        <ButtonController elementStore={elementStore} />}
                    {elementStore.selectedElem.tag === "image" &&
                        <ImageController elementStore={elementStore} />}
                    {elementStore.selectedElem.tag === "video" &&
                        <VideoController elementStore={elementStore} />}
                </> :
                <></>
            }
        </div>
    )
})




/*

const _ = observer(({ elementStore }) => {
    const element = elementStore.selectedElem;

    return (
        <div className={styles.optionRows}>
        </div>
    )
})

*/