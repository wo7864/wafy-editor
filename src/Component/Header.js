import { observer } from 'mobx-react';
import { useStores } from '../states/Context';
import Select from 'react-select';
import styles from '../static/css/Header.module.css';
import Converter from '../converter/Converter';
import { AiOutlineDesktop } from "react-icons/ai";

export default observer(() => {
    const { elementStore, stageStore } = useStores();
    const customStyle = {
        container: (provided, state) => ({
            ...provided,
            width: 60,
            backgroundColor: 'transparent',
        }),
        control: (provided, state) => ({
            ...provided,

            backgroundColor: 'transparent',
            border: 0,
            minHeight: 10,
        }),
        valueContainer: (provided, state) => ({
            ...provided,
            padding: 0,
            height:'1.4rem',
            fontSize:'1.4rem'
        }),
        indicatorSeparator: () => ({
            display: 'none'
        }),
        dropdownIndicator: (provided, state) => ({
            ...provided,
            color: '#454545',
            width: 20,
            padding: 0,
        }),
    }
    const options = [
        { value: 'desktop', label: <AiOutlineDesktop/> }
    ]


    
    const preview = () => {
        const data = {
            elements:{
                childElements:[...elementStore.childElements],
            }
        }
        Converter(data);
    }

    const save = () => {
        elementStore.save();
    }

    const load = () => {
        elementStore.load()
    }



    return (
        <div className={styles.headerContainer}>
            <strong>와피</strong>

            <div className={styles.containerSizeController}>

                <Select
                    styles={customStyle}
                    options={options}
                    defaultValue={{ value: 'desktop', label: <AiOutlineDesktop/> }}
                    isSearchable={false} />


                <div>
                    <span>W</span>
                    <input type="text"
                        value={stageStore.width}
                        onChange={(e) => {stageStore.setWidth(e.target.value)}} />

                </div>
                <div>
                    <span>H</span>
                    <input type="text"
                        value={stageStore.height}
                        onChange={(e) => {stageStore.setHeight(e.target.value)}} />

                </div>
            </div>

            <div className={styles.projectDeploy}>
                <button onClick={preview}>미리보기</button>
                <button onClick={save}>저장</button>
                <button onClick={load}>불러오기</button>
            </div>
        </div>
    )


})

