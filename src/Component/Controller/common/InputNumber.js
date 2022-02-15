import { observer } from 'mobx-react';
import { useStores } from '../../../states/Context';
import styles from '../../../static/css/Controller.module.css';

export default observer(({attr})=> {
    const { elementStore } = useStores();
    const element = elementStore.selectedElem;

    const onInput = (e) => {
        if(!isNaN(e.target.value))
            element.style.setStyle(attr, Number(e.target.value));
    }

    return (
        <input type="text"
            value={element.style[attr]}
            className={styles.smallInput}
            onInput={onInput} />
    )
})