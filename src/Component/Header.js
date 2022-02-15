import { observer } from 'mobx-react';
import { useStores } from '../states/Context';
//import Select from 'react-select';
import styles from '../static/css/Header.module.css';
import Converter from '../preview/Converter';
//import { AiOutlineDesktop } from "react-icons/ai";

export default observer(() => {
    const { elementStore, stageStore, userStore } = useStores();
    // const customStyle = {
    //     container: (provided, state) => ({
    //         ...provided,
    //         width: 60,
    //         backgroundColor: 'transparent',
    //     }),
    //     control: (provided, state) => ({
    //         ...provided,
    //         color:'#fff',
    //         backgroundColor: 'transparent',
    //         border: 0,
    //         minHeight: 10,
    //     }),
    //     valueContainer: (provided, state) => ({
    //         ...provided,
    //         padding: 0,
    //         height:'1.4rem',
    //         fontSize:'1.4rem'
    //     }),
    //     indicatorSeparator: () => ({
    //         display: 'none'
    //     }),
    //     dropdownIndicator: (provided, state) => ({
    //         ...provided,
    //         color: '#fff',
    //         width: 20,
    //         padding: 0,
    //     }),
    // }
    // const options = [
    //     { value: 'desktop', label: <AiOutlineDesktop/> }
    // ]


    
    const preview = () => {
        const data = {
            elements:{
                children:[...elementStore.children],
            }
        }
        Converter(data);
    }

    const save = async () => {
        const {id, project_id } = userStore

        await elementStore.save(id, project_id);
    }

    return (
        <div className={styles.headerContainer}>
				
            <strong>WAFY</strong>

            <div className={styles.containerSizeController}>

                {/* <Select
                    styles={customStyle}
                    options={options}
                    defaultValue={{ value: 'desktop', label: <AiOutlineDesktop/> }}
                    isSearchable={false} /> */}


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
                <button onClick={save}>저장하기</button>
            </div>
        </div>
    )


})

