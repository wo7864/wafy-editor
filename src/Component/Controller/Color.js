import { observer } from 'mobx-react';
import ColorPicker from './common/ColorPicker'

import styles from '../../static/css/Controller.module.css';

export default observer(({ elementStore }) => {
    return (
        <div className={styles.optionRows}
            style={{ position: 'relative', }}>
            <span>κΈμ μ</span>
            <ColorPicker
                elementStore={elementStore}
                attr="color" />
        </div>
    )
})