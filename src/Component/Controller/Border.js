import { observer } from 'mobx-react';

import { useStores } from '../../states/Context';

import ColorPicker from './common/ColorPicker'
import InputNumber from './common/InputNumber';

import styles from '../../static/css/Controller.module.css';

export default observer(() => {
    const {elementStore} = useStores();

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
                        <InputNumber attr="borderWidth"/>
                    </div>
                    <div>
                        <span>R</span>
                        <InputNumber attr="borderRadius"/>
                    </div>
                </div>

            </div>
        </div>
    )
})
