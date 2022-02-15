import { observer } from 'mobx-react';

import InputNumber from './common/InputNumber';

import styles from '../../static/css/Controller.module.css';

import {
    BsTypeBold,
    BsTypeItalic,
    BsTypeUnderline
} from "react-icons/bs";

export default observer(({ elementStore }) => {
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
                <InputNumber attr="fontSize"/>
            </div>
        </div>
    )
})