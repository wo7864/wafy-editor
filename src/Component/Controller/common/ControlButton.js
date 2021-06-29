import { observer } from 'mobx-react';
import { useStores } from '../../../states/Context';

import styles from '../../../static/css/Controller.module.css';

export default observer(({ attr, value, icon, style }) => {
    const { elementStore } = useStores();
    const element = elementStore.selectedElem;
    return <button className={[
        element.style[attr] === value ? styles.selected : '',
        element.style.locked.includes(attr) ? styles.locked : ''
    ].join(' ')}
        onClick={() => {
            if (!element.style.locked.includes(attr))
                element.style.setStyle(attr, value)
        }}
        style={style}>
        {icon}
    </button>
})
