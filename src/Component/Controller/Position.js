import { observer } from 'mobx-react';

import ControlButton from './common/ControlButton';

import styles from '../../static/css/Controller.module.css';

import { BiCollection } from "react-icons/bi";
import { 
    MdGridOn, 
    MdGridOff 
} from "react-icons/md";

export default observer(({ elementStore }) => {
    const element = elementStore.selectedElem;


    return (
        <div className={styles.optionRows}>
            <span>위치 기준</span>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                <div>
                    <ControlButton
                        attr="position"
                        value="relative"
                        icon={<MdGridOn />} />
                    <ControlButton
                        attr="position"
                        value="absolute"
                        icon={<MdGridOff />} />
                </div>

                <ControlButton
                    element={element}
                    attr="position"
                    value="sticky"
                    icon={<BiCollection />} />
            </div>
        </div>
    )
})