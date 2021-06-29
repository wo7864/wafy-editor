import { useState } from 'react';
import { observer } from 'mobx-react';

import styles from '../../static/css/Controller.module.css';

export default observer(({ elementStore }) => {
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
