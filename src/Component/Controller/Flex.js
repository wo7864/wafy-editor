import { observer } from 'mobx-react';

import ControlButton from './common/ControlButton';

import styles from '../../static/css/Controller.module.css';

import {
    BsArrowBarDown,
    BsArrowBarRight,
} from "react-icons/bs";

import {
    CgAlignBottom,
    CgAlignLeft,
    CgAlignMiddle,
    CgAlignRight,
    CgAlignCenter,
    CgAlignTop,

} from "react-icons/cg";

export default observer(({ elementStore }) => {
    const element = elementStore.selectedElem;
    const isRow = element.style.flexDirection === 'column' ? 1 : 0;
    return (
        <div className={styles.flexController}>
            <div className={styles.optionRows}>
                <span>정렬 방향</span>
                <div>
                    <ControlButton
                        attr="flexDirection"
                        value="column"
                        icon={<BsArrowBarDown />} />
                    <ControlButton
                        attr="flexDirection"
                        value="row"
                        icon={<BsArrowBarRight />} />
                </div>

            </div>

            <div className={styles.optionRows}>
                <span>주 축</span>
                <div>
                    <ControlButton
                        attr="justifyContent"
                        value="center"
                        icon={isRow ? <CgAlignCenter /> : <CgAlignMiddle />} />
                    <ControlButton
                        attr="justifyContent"
                        value="flex-start"
                        icon={isRow ? <CgAlignTop /> : <CgAlignLeft />} />
                    <ControlButton
                        attr="justifyContent"
                        value="flex-end"
                        icon={isRow ? <CgAlignBottom /> : <CgAlignRight />} />
                    {/* <ControlButton
                        attr="justifyContent"
                        value="space-between"
                        icon={<BsArrowBarDown />} />
                    <ControlButton
                        attr="justifyContent"
                        value="space-around"
                        icon={<BsArrowBarDown />} />
                    <ControlButton
                        attr="justifyContent"
                        value="space-evenly"
                        icon={<BsArrowBarDown />} /> */}

                </div>
            </div>

            <div className={styles.optionRows}>
                <span>교차 축</span>
                <div>
                    <ControlButton
                        attr="alignItems"
                        value="center"
                        icon={isRow ? <CgAlignMiddle /> : <CgAlignCenter />} />
                    <ControlButton
                        attr="alignItems"
                        value="flex-start"
                        icon={isRow ? <CgAlignLeft /> : <CgAlignTop />} />
                    <ControlButton
                        attr="alignItems"
                        value="flex-end"
                        icon={isRow ? <CgAlignRight /> : <CgAlignBottom />} />
                    {/* <ControlButton
                        attr="alignItems"
                        value="stretch"
                        icon={<BsArrowBarDown />} />
                    <ControlButton
                        attr="alignItems"
                        value="baseline"
                        icon={<BsArrowBarDown />} /> */}


                </div>
            </div>

            {/* <div className={styles.optionRows}>
                <span>교차 축(2줄 이상)</span>
                <div>
                    <ControlButton
                        attr="alignContent"
                        value="center"
                        icon={<BsArrowBarDown />} />
                    <ControlButton
                        attr="alignContent"
                        value="flex-start"
                        icon={<BsArrowBarDown />} />
                    <ControlButton
                        attr="alignContent"
                        value="flex-end"
                        icon={<BsArrowBarDown />} />
                    <ControlButton
                        attr="alignContent"
                        value="space-between"
                        icon={<BsArrowBarDown />} />
                    <ControlButton
                        attr="alignContent"
                        value="space-around"
                        icon={<BsArrowBarDown />} />
                    <ControlButton
                        attr="alignContent"
                        value="stretch"
                        icon={<BsArrowBarDown />} />

                </div>
            </div>
            <div className={styles.optionRows}>
                <span>줄 바꿈</span>
                <div>
                    <ControlButton
                        attr="flexWrap"
                        value="nowrap"
                        icon={<BsArrowBarDown />} />
                    <ControlButton
                        attr="flexWrap"
                        value="wrap"
                        icon={<BsArrowBarRight />} />
                </div>

            </div> */}

        </div>
    )
})