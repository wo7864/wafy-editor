import { useState } from 'react';
import { observer } from 'mobx-react';
import ShadowColorPicker from './common/ShadowColorPicker'

import styles from '../../static/css/Controller.module.css';

export default observer(({ elementStore }) => {
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