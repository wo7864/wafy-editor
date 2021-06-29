import { observer } from 'mobx-react';

import ControlButton from './common/ControlButton';

import styles from '../../static/css/Controller.module.css';

import {
    BsTextLeft,
    BsTextRight,
    BsTextCenter,
} from "react-icons/bs";

export default observer(() => {

    return (
        <div className={styles.optionRows}>
            <span>정렬</span>
            <div>
                <ControlButton
                    attr="textAlign"
                    value="left"
                    icon={<BsTextLeft />}/>
                <ControlButton
                    attr="textAlign"
                    value="center"
                    icon={<BsTextCenter />}/>
                <ControlButton
                    attr="textAlign"
                    value="right"
                    icon={<BsTextRight />}/>
            </div>
        </div>
    )
})