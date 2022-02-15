import { observer } from 'mobx-react';

import styles from '../../static/css/Controller.module.css';

export default observer(({ elementStore }) => {
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