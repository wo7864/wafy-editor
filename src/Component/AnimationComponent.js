//import '../static/css/AnimationComponent.css';
import { useStores } from '../states/Context';
import { useState } from 'react';
import { observer } from 'mobx-react';

import { MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdClose } from "react-icons/md";

import finAnima from 'finished-animation/'
import cloneDeep from 'lodash/cloneDeep'
import easingFunction from '../animation/easingFunction'

const EventListBox = ({ event }) => {
    const [isOpen, toggle] = useState(false);
    return (
        <div className="animation-event">
            <button onClick={() => toggle(!isOpen)} style={{ padding: 0, zIndex: 1 }}>
                <div className="selected-event">
                    <span>{event.selected} Event</span>
                    <MdKeyboardArrowRight size={18}
                        className={isOpen ? "open" : "close"} />
                </div>
            </button>
            <div className={["event-list-container", isOpen ? "open" : "close"].join(" ")}>
                {event.list.map((item, index) => (
                    <button key={"event-button-" + index}
                        onClick={() => { event.select(item.value); toggle(false) }}>
                        {item.text}
                    </button>
                ))}
            </div>
        </div>
    )
}




const ListContainer = ({ elementStore, selectedEvent }) => {

    const AnimationSelectorBox = ({ title, animations }) => {
        return (
            <div className="type-container">
                <div className="type-title">
                    <span>{title}</span>
                    <MdKeyboardArrowDown size={"0.8rem"} />
                </div>
                {Object.keys(animations).map((key, index) => {
                    animations[key].name = key;
                    return (
                        <button key={"animation-detail-" + index}
                            onClick={() => {
                                const cloneAnima = cloneDeep(animations[key].params);
                                elementStore.addAnimation(selectedEvent, { name: key, ...cloneAnima })
                            }}>
                            <span>{key}</span>
                        </button>
                    )
                })}
            </div>
        )
    }

    return (
        <div className="list-container">
            <AnimationSelectorBox
                title="공통 애니메이션"
                animations={finAnima.commonData} />

            <AnimationSelectorBox
                title="텍스트 애니메이션"
                animations={finAnima.textData} />
            <AnimationSelectorBox
                title="이미지 애니메이션"
                animations={finAnima.imageData} />
            <AnimationSelectorBox
                title="버튼 애니메이션"
                animations={finAnima.buttonData} />

        </div>
    )
}

const PreviewContainer = () => {
    return (
        <div className="preview-container">
            <div className="target-element">Click Me!</div>
        </div>
    )
}

const DetailContainer = observer(({ elementStore, event, assetStore }) => {
    const element = elementStore.selectedElem;
    const anima = element.animation[event];

    const AssetImages = ({ attr }) => {
        const [isView, toggle] = useState(false);
        return (
            <div className="asset-images-container">
                <button onClick={() => toggle(!isView)}>이미지 선택</button>
                {isView &&
                    <div className="images-modal">{assetStore.images.map((image, index) => {

                        return (
                            <button key={"image_" + index}>
                                <img src={image.src}
                                    alt={"image_" + index}
                                    onClick={() => anima[attr].value = image.src} />
                            </button>
                        )
                    })}</div>
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
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={() => anima[attr].value = value}
                        readOnly={attr === 'target' ? ' true' : ''}
                    />
                )
        }

        return (
            <div>
                <span>{attr}</span>

                {inputBox}

                {anima[attr].unit ?
                    <span>{anima[attr].unit}</span> : ""}
                {//currentAnima.unit && <span>{currentAnima.unit}</span>
                }
            </div>
        )
    }




    return (
        <div className="animation-detail-container">
            {anima !== null ?
                <>
                    <div className="header">
                        <span>{anima.name}</span>
                    </div>
                    <div className="contents-container">

                        {Object.keys(anima).map((attr, index) => {
                            if(attr === "name") return ""
                            return (
                                <InputText
                                    key={"attr_" + index}
                                    attr={attr} />
                            )
                        })}


                    </div>
                </> :
                <></>}
        </div>
    )
})

export default function AnimationComponent() {
    const { elementStore, windowStore, assetStore } = useStores();
    const [selectedEvent, selectEvent] = useState('hover');
    const eventList = [
        {
            text: "scroll",
            value: "scroll"
        },
        {
            text: "hover",
            value: "hover"
        }, {
            text: "Click",
            value: "click"
        }, {
            text: "Double Click",
            value: "dblclick"
        },
    ]

    const closeModal = (e) => {
        if (e.target === document.body.querySelector('.modal-container'))
            windowStore.toggle("animationComponent", false)
    }

    return (
        <div className="modal-container"
            onClick={closeModal}>

            <div className="animation-container">
                <div className="animation-header">
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <span className="target-element-id">{elementStore.selectedElem.id}</span>
                        <EventListBox event={{
                            list: eventList,
                            selected: selectedEvent,
                            select: selectEvent
                        }} />
                    </div>
                    <MdClose size={20} />
                </div>
                <div className="animation-contents">
                    <ListContainer
                        elementStore={elementStore}
                        selectedEvent={selectedEvent} />

                    <div className="right-container">
                        <PreviewContainer element={elementStore.selectedElem} />
                        <DetailContainer
                            elementStore={elementStore}
                            assetStore={assetStore}
                            event={selectedEvent} />
                    </div>

                </div>
            </div>
        </div>
    )
}