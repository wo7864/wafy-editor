import { 
    useState,
    useEffect,
    useRef
 } from 'react';
import { SketchPicker } from 'react-color';

import styles from '../../../static/css/Controller.module.css';

// 일반 colorpicker 도구
export default function ColorPicker({ elementStore, attr }){
    const element = elementStore.selectedElem;
    const [isOpen, toggle] = useState(false);
    const [color, setColor] = useState(element.style[attr]);
    const pickerRef = useRef(null);
    useEffect(() => {

        return () => toggle(false); // cleanup function을 이용
    }, []);

    useEffect(() => {
        if (pickerRef.current) {
            const bottom = pickerRef.current.getBoundingClientRect().bottom + 302;
            const picker = pickerRef.current.querySelector('.sketch-picker');
            if (picker && bottom > window.innerHeight) {
                picker.style.bottom = 0
            }
        }
    });

    const togglePicker = () => {
        const closeEvent = (e) => {
            if (!e.path.includes(document.querySelector(`#${attr}-picker`))) toggle(false);
            document.removeEventListener('click', closeEvent, true)
        }
        document.addEventListener('click', closeEvent, true)
        toggle(true);
    }


    return (
        <div id={attr + "-picker"}
            ref={pickerRef}
            className={styles.colorPicker}
            style={{ backgroundColor: color }}
            onClick={() => togglePicker(!isOpen)}>
            {isOpen &&
                <SketchPicker
                    className={styles.picker}

                    color={color}
                    onChange={(c) => setColor(`rgba(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}, ${c.rgb.a})`)}
                    onChangeComplete={(c) => element.style.setStyle(attr, `rgba(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}, ${c.rgb.a})`)} />}
        </div>
    )
}
