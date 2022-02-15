import { useState } from 'react';
import { observer } from 'mobx-react';

import styles from '../../static/css/Controller.module.css';

import {  BiCheck } from "react-icons/bi";
import { GoPencil } from "react-icons/go";

export default observer(({ elementStore }) => {
    const element = elementStore.selectedElem;
    const [editable, toggle] = useState(false);
    const [id, setId] = useState(element.id)
    const blur = () => {
        element.setProperty('id', id)
        toggle(false);
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
