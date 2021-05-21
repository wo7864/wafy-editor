import { useStores } from '../states/Context';
import { observer } from 'mobx-react';
import { useState } from 'react';
import finAnima from 'finished-animation/'
import cloneDeep from 'lodash/cloneDeep'
import easingFunction from '../animation/easingFunction'

import animaStyles from '../static/css/Controller__Animation.module.css';
import styles from '../static/css/Controller.module.css';
import { RiImageAddFill } from "react-icons/ri";
import { HiChevronDown } from "react-icons/hi";
import {Assets} from './Tool'
const DetailContainer = observer(({ elementStore, event, assetStore, stageStore }) => {
    const element = elementStore.selectedElem;
    const anima = element.animation[event];
    const noInput = ['name', 'isScroll', 'start', 'end']
    console.log(anima)

    if (anima && event === 'scroll') {
        if (anima.isScroll === undefined)
            anima.isScroll = false

        if (anima.start === null || anima.start === undefined) {
            anima.start = {
                type: 'text',
                default: 100
            }
            anima.end = {
                type: 'text',
                default: 500
            }
        }
    }

    const AssetImages = ({ attr }) => {
        const [isView, toggle] = useState(false);
        return (
            <div className="asset-images-container">
                <button className={animaStyles.normalButton}
                    onClick={() => toggle(!isView)}>
                    <RiImageAddFill />
                </button>
               
                {isView &&
                    <div className={animaStyles.imagesModal}>

                    <Assets tab="images"
                        clickEvent={(image) => {anima[attr].value = image.src; toggle(false)}}/>
                    </div>
                }

            </div>
        )
    }


    const InputText = ({ attr }) => {
        if (anima[attr].value === undefined) {
            anima[attr].value = anima[attr].default
        }
        let val = anima[attr].value
        if (attr === 'target') val = 'self';
        const [value, setValue] = useState(val)
        anima[attr].value = value

        let inputBox;

        switch (anima[attr].type) {
            case 'select/ease':
                inputBox =
                    (<select>
                        {Object.keys(easingFunction).map(key => {
                            return <option key={`easing-${key}`} value={key}>{key}</option>
                        })}
                    </select>)
                break;
            case 'file/image':
                inputBox = (
                    <AssetImages
                        attr={attr} />

                )
                break;

            case 'checkbox':
                inputBox = (
                    <input type="checkbox" />
                )
                break;
            default:
                inputBox = (
                    <input type="text" value={value}
                        className={styles.midInput}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={() => anima[attr].value = value}
                        readOnly={attr === 'target' ? ' true' : ''}
                    />
                )
        }

        return (
            <div className={animaStyles.optionRows}>
                <span>{attr}</span>

                <div>
                    {inputBox}

                    {anima[attr].unit ?
                        <span>{anima[attr].unit}</span> : ""}
                    {//currentAnima.unit && <span>{currentAnima.unit}</span>
                    }
                </div>
            </div>
        )
    }




    return (
        <div className={animaStyles.animationDetail}>
            {anima !== null ?
                <>
                    
                    <div className="contents-container">

                        {Object.keys(anima).map((attr, index) => {
                            if (noInput.includes(attr)) return ""
                            if(!anima[attr]) return ""
                            return (
                                <InputText
                                    key={"attr_" + index}
                                    attr={attr} />
                            )
                        })}
                        {event === "scroll" &&
                            <>
                                <p>
                                    현재 스크롤 값: {stageStore.scrollTop}
                                </p>
                                <InputText
                                    key={"attr_start"}
                                    attr={'start'} />
                                <InputText
                                    key={"attr_end"}
                                    attr={"end"} />
                            </>
                        }


                    </div>
                </> :
                <></>}
        </div>
    )
})



const AnimationList = ({ event, elementStore }) => {
    const element = elementStore.selectedElem
    const anima = element.animation[event]
    //const [type, setType] = useState('common')
    const type = element.tag
    const [isOpen, toggle] = useState(false)
    const AnimationSelectorBox = ({ animations }) => {

        if(!animations) return <></>;
        return (
            <>
                {Object.keys(animations).map((key, index) => {
                    animations[key].name = key;
                    if (animations[key].event[event] === 0) return ""
                    return (
                        <button key={"animation-detail-" + index}
                            onClick={() => {
                                const cloneAnima = cloneDeep(animations[key].params);
                                elementStore.addAnimation(event, { name: key, ...cloneAnima })
                                toggle(false);
                            }}>
                            <span>{key}</span>
                        </button>
                    )
                })}
            </>
        )
    }


    return (
        <>
            <button className={animaStyles.selectAnimation}
                onClick={() => toggle(!isOpen)}
            >
                {anima ? anima.name : "애니메이션 추가하기"}
                <HiChevronDown />
            </button>
            { isOpen ?
                <div className={animaStyles.listContainer}>
                    <button onClick={() => { elementStore.addAnimation(event, null);toggle(false); }}>
                        <span>없음</span>
                    </button>
                    <AnimationSelectorBox animations={finAnima['commonData']} />
                    <AnimationSelectorBox animations={finAnima[type + 'Data']} />
                </div> :
                <></>
            }

        </>
    )
}



export default observer(() => {
    const { elementStore, assetStore, stageStore } = useStores();
    const element = elementStore.selectedElem
    const [selectedEvent, changeEvent] = useState("view")

    const EventTab = ({ event }) => {
        return (
            <button className={selectedEvent === event ? animaStyles.selectedTab : ""}
                onClick={() => changeEvent(event)}>
                {event}
            </button>
        )
    }

    return (
        <div className={animaStyles.container}>
            <div className={animaStyles.tab}>
                <EventTab event="view" />
                <EventTab event="scroll" />
                <EventTab event="hover" />
                <EventTab event="click" />

            </div>
            <AnimationList
                event={selectedEvent}
                elementStore={elementStore}
                stageStore={stageStore}
            />

            {
                element.animation[selectedEvent] ?
                    <DetailContainer
                        elementStore={elementStore}
                        assetStore={assetStore}
                        stageStore={stageStore}
                        event={selectedEvent} />
                    :
                    <></>

            }


        </div>
    )
})