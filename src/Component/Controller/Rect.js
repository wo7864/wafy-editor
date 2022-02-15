import { useState } from 'react';
import { observer } from 'mobx-react';

import InputNumber from './common/InputNumber';

import styles from '../../static/css/Controller.module.css';


export default observer(({ elementStore }) => {
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
                    <InputNumber attr="left"/>
                    <SelectTab attr="leftUnit" />
                </div>
                <div>
                    <span>Y</span>
                    <InputNumber attr="top"/>
                    <SelectTab attr="topUnit" />
                </div>
            </div>
            <div className={styles.small}>
                <div>
                    <span>W</span>
                    <InputNumber attr="width"/>
                    <SelectTab attr="widthUnit" />
                </div>
                <div>
                    <span>H</span>
                    <InputNumber attr="height"/>
                    <SelectTab attr="heightUnit" />
                </div>
            </div>
        </div>
    )
})