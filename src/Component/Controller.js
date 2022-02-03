import { useState, useEffect, useRef } from 'react';

import { useStores } from '../states/Context';
import { observer } from 'mobx-react';
import { SketchPicker } from 'react-color';
import ControlAnimation from './ControlAnimation'
import { ValidElemId } from '../util/validator';
import {
    BsBoundingBoxCircles,
    BsSubtract,
    BsCollectionPlay,
    BsArrowBarDown,
    BsArrowBarRight,
    BsTextLeft,
    BsTextRight,
    BsTextCenter,
    BsTypeBold,
    BsTypeItalic,
    BsTypeUnderline
} from "react-icons/bs";
import { BiCollection, BiCheck } from "react-icons/bi";
import { GoPencil } from "react-icons/go";
import { SiVlcmediaplayer } from "react-icons/si";
import { IoPlaySkipForwardSharp } from "react-icons/io5";
import { MdGridOn, MdGridOff } from "react-icons/md";
import {
    CgAlignBottom,
    CgAlignLeft,
    CgAlignMiddle,
    CgAlignRight,
    CgAlignCenter,
    CgAlignTop,

} from "react-icons/cg";

import styles from '../static/css/Controller.module.css';


const ControlButton = observer(({ element, attr, value, icon, style, additionalEvent = () => { } }) => {

    return <button className={[
        element.style[attr] === value ? styles.selected : '',
        element.style.locked.includes(attr) ? styles.locked : ''
    ].join(' ')}
        onClick={() => {
            if (!element.style.locked.includes(attr))
                element.style.setStyle(attr, value)
            additionalEvent();
        }}
        style={style}>
        {icon}
    </button>
})


// 일반 colorpicker 도구
const ColorPicker = ({ elementStore, attr }) => {
    const element = elementStore.selectedElem;
    const [isOpen, toggle] = useState(false);
    const [color, setColor] = useState(element.style[attr]);
    const pickerRef = useRef(null);
    useEffect(() => {

        return () => toggle(false); // cleanup function을 이용
    }, []);

    useEffect(() => {
        if (pickerRef.current) {
            const bottom = pickerRef.current.getBoundingClientRect().bottom + 302;
            const picker = pickerRef.current.querySelector('.sketch-picker');
            if (picker && bottom > window.innerHeight) {
                picker.style.bottom = 0
            }
        }
    });

    const togglePicker = () => {
        const closeEvent = (e) => {
            if (!e.path.includes(document.querySelector(`#${attr}-picker`))) toggle(false);
            document.removeEventListener('click', closeEvent, true)
        }
        document.addEventListener('click', closeEvent, true)
        toggle(true);
    }


    return (
        <div id={attr + "-picker"}
            ref={pickerRef}
            className={styles.colorPicker}
            style={{ backgroundColor: color }}
            onClick={() => togglePicker(!isOpen)}>
            {isOpen &&
                <SketchPicker
                    className={styles.picker}

                    color={color}
                    onChange={(c) => setColor(`rgba(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}, ${c.rgb.a})`)}
                    onChangeComplete={(c) => element.style.setStyle(attr, `rgba(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}, ${c.rgb.a})`)} />}
        </div>
    )
}

// 그림자전용 color picker 도구
const ShadowColorPicker = ({ color, setColor, attr }) => {
    const [isOpen, toggle] = useState(false);
    useEffect(() => {
        return () => toggle(false); // cleanup function을 이용
    }, []);
    const togglePicker = () => {
        const closeEvent = (e) => {
            if (!e.path.includes(document.querySelector(`#${attr}-picker`))) toggle(false);
            document.removeEventListener('click', closeEvent, true)
        }
        document.addEventListener('click', closeEvent, true)
        toggle(true);
    }

    return (
        <div id={attr + "-picker"} className={styles.colorPicker} style={{ backgroundColor: color }}
            onClick={() => togglePicker(!isOpen)}>
            {isOpen &&
                <SketchPicker
                    className={styles.picker}
                    style={{ position: 'fixed' }}
                    color={color}
                    onChange={(c) => setColor(c)}
                    onChangeComplete={(c) => setColor(c)} />}
        </div>
    )
}


const IdController = observer(({ elementStore }) => {
    const element = elementStore.selectedElem;
    const [editable, toggle] = useState(false);
    const [id, setId] = useState(element.id)
    const blur = () => {
        if(!ValidElemId(id))
            alert('no!')
        else{
            element.setProperty('id', id)
            toggle(false);
            alert('yes!')
        }
    }
    return (
        <div className={styles.optionId}>
            {editable ?
                <>
                    <input type="text"
                        className={styles.inputId}
                        value={id}
                        onBlur={blur}
                        onChange={(e) => setId(e.target.value)}
                        style={{ display: 'inline' }} />
                    <BiCheck
                        onClick={blur}
                        style={{ marginLeft: 5 }} />
                </> :
                <>
                    <span>{element.id}</span>
                    <GoPencil
                        onClick={() => toggle(true)}
                        style={{ marginLeft: 5 }} />
                </>
            }

        </div>
    )
})




const RectController = observer(({ elementStore }) => {
    const element = elementStore.selectedElem;

    const SelectTab = ({ attr }) => {
        const [isOpen, toggle] = useState(false);
        const unitList = ["px", "%", "vw", "vh"];

        return (
            <>
                <button onClick={() => toggle(!isOpen)}>{element.style[attr]}</button>
                {isOpen ?
                    <div className={styles.selectContainer}>
                        {unitList.map((unit, index) => {
                            return (
                                <button key={`${attr}_${unit}_${index}`}
                                    onClick={() => {
                                        element.style.setStyle(attr, unit)
                                        toggle(false);
                                    }}>
                                    {unit}
                                </button>)
                        })}
                    </div> :
                    <></>}
            </>
        )
    }

    return (
        <div className={styles.optionRows}>
            <span>위치</span>
            <div className={styles.small} >
                <div>
                    <span>X</span>
                    <input type="text" value={element.style.left} className={styles.smallInput}
                        onInput={(e) => element.style.setStyle('left', Number(e.target.value))} />
                    <SelectTab attr="leftUnit" />
                </div>
                <div>
                    <span>Y</span>
                    <input type="text" value={element.style.top} className={styles.smallInput}
                        onInput={(e) => element.style.setStyle('top', Number(e.target.value))} />
                    <SelectTab attr="topUnit" />
                </div>
            </div>
            <div className={styles.small}>
                <div>
                    <span>W</span>
                    <input type="text" value={element.style.width} className={styles.smallInput}
                        onInput={(e) => element.style.setStyle('width', Number(e.target.value))} />
                    <SelectTab attr="widthUnit" />
                </div>
                <div>
                    <span>H</span>
                    <input type="text" value={element.style.height} className={styles.smallInput}
                        onInput={(e) => element.style.setStyle('height', Number(e.target.value))} />
                    <SelectTab attr="heightUnit" />
                </div>
            </div>
        </div>
    )
})
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

const PositionController = observer(({ elementStore }) => {
    const element = elementStore.selectedElem;


    return (
        <div className={styles.optionRows}>
            <span>위치 기준</span>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                <div>
                    <ControlButton
                        element={element}
                        attr="position"
                        value="relative"
                        icon={<MdGridOn />}
                        additionalEvent={() => {
                            element.style.setStyle('left', 0)
                            element.style.setStyle('top', 0)
                        }} />
                    <ControlButton
                        element={element}
                        attr="position"
                        value="absolute"
                        icon={<MdGridOff />} />
                </div>

                <ControlButton
                    element={element}
                    attr="position"
                    value="sticky"
                    icon={<BiCollection />} />
            </div>
        </div>
    )
})

const FlexController = observer(({ elementStore }) => {
    const element = elementStore.selectedElem;
    const isRow = element.style.flexDirection === 'column' ? 1 : 0;
    return (
        <div className={styles.flexController}>
            <div className={styles.optionRows}>
                <span>정렬 방향</span>
                <div>
                    <ControlButton
                        element={element}
                        attr="flexDirection"
                        value="column"
                        icon={<BsArrowBarDown />} />
                    <ControlButton
                        element={element}
                        attr="flexDirection"
                        value="row"
                        icon={<BsArrowBarRight />} />
                </div>

            </div>

            <div className={styles.optionRows}>
                <span>주 축</span>
                <div>
                    <ControlButton
                        element={element}
                        attr="justifyContent"
                        value="center"
                        icon={isRow ? <CgAlignCenter /> : <CgAlignMiddle />} />
                    <ControlButton
                        element={element}
                        attr="justifyContent"
                        value="flex-start"
                        icon={isRow ? <CgAlignTop /> : <CgAlignLeft />} />
                    <ControlButton
                        element={element}
                        attr="justifyContent"
                        value="flex-end"
                        icon={isRow ? <CgAlignBottom /> : <CgAlignRight />} />
                    <ControlButton
                        element={element}
                        attr="justifyContent"
                        value="space-between"
                        icon={<BsArrowBarDown />} />
                    <ControlButton
                        element={element}
                        attr="justifyContent"
                        value="space-around"
                        icon={<BsArrowBarDown />} />
                    <ControlButton
                        element={element}
                        attr="justifyContent"
                        value="space-evenly"
                        icon={<BsArrowBarDown />} />

                </div>
            </div>

            <div className={styles.optionRows}>
                <span>교차 축</span>
                <div>
                    <ControlButton
                        element={element}
                        attr="alignItems"
                        value="center"
                        icon={isRow ? <CgAlignMiddle /> : <CgAlignCenter />} />
                    <ControlButton
                        element={element}
                        attr="alignItems"
                        value="flex-start"
                        icon={isRow ? <CgAlignLeft /> : <CgAlignTop />} />
                    <ControlButton
                        element={element}
                        attr="alignItems"
                        value="flex-end"
                        icon={isRow ? <CgAlignRight /> : <CgAlignBottom />} />
                    <ControlButton
                        element={element}
                        attr="alignItems"
                        value="stretch"
                        icon={<BsArrowBarDown />} />
                    <ControlButton
                        element={element}
                        attr="alignItems"
                        value="baseline"
                        icon={<BsArrowBarDown />} />


                </div>
            </div>

            <div className={styles.optionRows}>
                <span>교차 축(2줄 이상)</span>
                <div>
                    <ControlButton
                        element={element}
                        attr="alignContent"
                        value="center"
                        icon={<BsArrowBarDown />} />
                    <ControlButton
                        element={element}
                        attr="alignContent"
                        value="flex-start"
                        icon={<BsArrowBarDown />} />
                    <ControlButton
                        element={element}
                        attr="alignContent"
                        value="flex-end"
                        icon={<BsArrowBarDown />} />
                    <ControlButton
                        element={element}
                        attr="alignContent"
                        value="space-between"
                        icon={<BsArrowBarDown />} />
                    <ControlButton
                        element={element}
                        attr="alignContent"
                        value="space-around"
                        icon={<BsArrowBarDown />} />
                    <ControlButton
                        element={element}
                        attr="alignContent"
                        value="stretch"
                        icon={<BsArrowBarDown />} />

                </div>
            </div>
            <div className={styles.optionRows}>
                <span>줄 바꿈</span>
                <div>
                    <ControlButton
                        element={element}
                        attr="flexWrap"
                        value="nowrap"
                        icon={<BsArrowBarDown />} />
                    <ControlButton
                        element={element}
                        attr="flexWrap"
                        value="wrap"
                        icon={<BsArrowBarRight />} />
                </div>

            </div>

        </div>
    )
})


const FontFamilyController = observer(({ elementStore }) => {
    const element = elementStore.selectedElem;

    return (
        <div className={styles.optionRows}>
            <span>폰트</span>
            <select defaultValue={element.style.fontFamily}
                onChange={(e) => element.style.setStyle('fontFamily', e.target.value)}>
                <option value="Noto Sans KR">Noto Sans KR</option>
                <option value="NanumSqaure">NanumSqaure</option>
            </select>
        </div>
    )
})

const TextAlignController = observer(({ elementStore }) => {
    const element = elementStore.selectedElem;

    return (
        <div className={styles.optionRows}>
            <span>정렬</span>
            <div>
                <button className={element.style.textAlign === "left" ? styles.selected : ""}
                    onClick={() => element.style.setStyle('textAlign', 'left')}><BsTextLeft /></button>
                <button className={element.style.textAlign === "center" ? styles.selected : ""}
                    onClick={() => element.style.setStyle('textAlign', 'center')}><BsTextCenter /></button>
                <button className={element.style.textAlign === "right" ? styles.selected : ""}
                    onClick={() => element.style.setStyle('textAlign', 'right')}><BsTextRight /></button>
            </div>
        </div>
    )
})

const FontStyleController = observer(({ elementStore }) => {
    const element = elementStore.selectedElem;

    return (
        <div className={styles.optionRows}>
            <div className={styles.fontController}>
                <div className={styles.decorationController}>
                    <button className={element.style.fontWeight === "700" ? styles.selected : ""}
                        onClick={() => element.style.setStyle('fontWeight', element.style.fontWeight === "700" ? "400" : "700")}><BsTypeBold /></button>
                    <button className={element.style.fontStyle === "italic" ? styles.selected : ""}
                        onClick={() => element.style.setStyle('fontStyle', element.style.fontStyle === "italic" ? "normal" : "italic")}><BsTypeItalic /></button>
                    <button className={element.style.textDecoration === "underline" ? styles.selected : ""}
                        onClick={() => element.style.setStyle('textDecoration', element.style.textDecoration === "underline" ? "none" : "underline")}><BsTypeUnderline /></button>
                </div>
                <input type="text" value={element.style.fontSize} className={styles.smallInput}
                    onInput={(e) => element.style.setStyle('fontSize', Number(e.target.value))} />
            </div>
        </div>
    )
})

const BackgroundColorController = observer(({ elementStore }) => {
    return (
        <div className={styles.optionRows}
            style={{ position: 'relative', }}>
            <span>배경 색</span>
            <ColorPicker
                elementStore={elementStore}
                attr="backgroundColor" />
        </div>
    )
})
const ColorController = observer(({ elementStore }) => {
    return (
        <div className={styles.optionRows}
            style={{ position: 'relative', }}>
            <span>글자 색</span>
            <ColorPicker
                elementStore={elementStore}
                attr="color" />
        </div>
    )
})

const BorderController = observer(({ elementStore }) => {
    const element = elementStore.selectedElem;

    return (
        <div className={styles.optionRows}
            style={{ position: 'relative', }}>
            <span>외곽선</span>

            <div className={styles.borderController}>
                <ColorPicker
                    elementStore={elementStore}
                    attr="borderColor" />
                <div style={{ display: 'flex' }}>
                    <div style={{ marginRight: 10 }}>
                        <span>W</span>
                        <input type="text" value={element.style.borderWidth} className={styles.smallInput}
                            onInput={(e) => element.style.setStyle('borderWidth', Number(e.target.value))} />
                    </div>
                    <div>
                        <span>R</span>
                        <input type="text" value={element.style.borderRadius} className={styles.smallInput}
                            onInput={(e) => element.style.setStyle('borderRadius', Number(e.target.value))} />
                    </div>
                </div>

            </div>


        </div>
    )

})

const ShadowController = observer(({ elementStore }) => {
    const element = elementStore.selectedElem;
    const [boxShadow, setBoxShadow] = useState(element.style.boxShadow.split("px"));
    const [isDown, down] = useState(false);
    const updateBoxShadow = (index, value, index2, value2) => {
        const data = [...boxShadow];
        data[index] = value;
        if (index2) data[index2] = value2
        setBoxShadow(data)
        element.style.setStyle('boxShadow', `${data[0]}px ${data[1]}px ${data[2]}px ${data[3]}px ${data[4]}`)
    }

    const startMoveShadow = (e) => {

        updateBoxShadow(0, e.nativeEvent.offsetX - 50,
            1, e.nativeEvent.offsetY - 50);
        down(true);
    }
    const moveShadow = (e) => {
        if (!isDown) return;
        updateBoxShadow(0, e.nativeEvent.offsetX - 50,
            1, e.nativeEvent.offsetY - 50);
    }

    const EndMoveShadow = () => {
        down(false)
    }


    const setColor = (c) => {
        const color = `rgba(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}, ${c.rgb.a})`;
        updateBoxShadow(4, color);
    }
    return (
        <div className={styles.optionRows}>
            <span>그림자</span>
            <div className={styles.shadowController}>
                <div className={styles.shadowExampleContainer}
                    onMouseDown={startMoveShadow}
                    onMouseMove={moveShadow}
                    onMouseUp={EndMoveShadow}
                    onMouseLeave={EndMoveShadow}>
                    <div className={styles.shadowExample}
                        style={{ boxShadow: element.style.boxShadow }}>

                    </div>
                </div>
                <div className={styles.shadowOptionContainer}>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>흐림</span>
                            <span>{boxShadow[2]}</span>
                        </div>
                        <input type="range" value={boxShadow[2]}
                            max={15} min={0} step={1}
                            onChange={(e) => updateBoxShadow(2, Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>퍼짐</span>
                            <span>{boxShadow[3]}</span>
                        </div>
                        <input type="range" value={boxShadow[3]}
                            max={15} min={-5} step={1}
                            onChange={(e) => updateBoxShadow(3, Number(e.target.value))} />
                    </div>
                    <ShadowColorPicker
                        color={boxShadow[4]}
                        setColor={setColor}
                        attr="box-shadow" />
                </div>
            </div>
        </div>
    )
})

const BackdropFilterController = observer(({ elementStore }) => {
    const element = elementStore.selectedElem;
    const [value, setValue] = useState(element.style.backdropFilter.replace(/[^0-9]/g, ''))

    const updateValue = v => {
        setValue(v);
        element.style.setStyle('backdropFilter', `blur(${v}px)`)
    }
    return (
        <div className={styles.optionRows}>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span>배경 블러</span>
                <span>{value}</span>

            </div>
            <input type="range" value={value}
                max={50} min={0} step={0.2}
                onChange={(e) => updateValue(e.target.value)} />

        </div>
    )
})

const VideoTypeController = observer(({ elementStore }) => {
    const element = elementStore.selectedElem;
    return (
        <div className={styles.optionRows}>
            <span>비디오 타입</span>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <button className={element.videoType === "normal" ? styles.selected : ""}
                        onClick={() => element.setProperty('videoType', 'normal')}><IoPlaySkipForwardSharp /></button>
                    <button className={element.videoType === "scroll" ? styles.selected : ""}
                        onClick={() => element.setProperty('videoType', 'scroll')}><SiVlcmediaplayer /></button>
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
                    <TextAlignController elementStore={elementStore} />
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