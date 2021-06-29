import { 
    useState,
    useEffect,
 } from 'react';
import { SketchPicker } from 'react-color';

import styles from '../../../static/css/Controller.module.css';

// 그림자전용 color picker 도구
export default function ShadowColorPicker({ color, setColor, attr }){
    const [isOpen, toggle] = useState(false);
    useEffect(() => {
        return () => toggle(false); // cleanup function을 이용
    }, []);
    const togglePicker = () => {
        const closeEvent = (e) => {
            if (!e.path.includes(document.querySelector(`#${attr}-picker`))) toggle(false);
            document.removeEventListener('click', closeEvent, true)
        }
        document.addEventListener('click', closeEvent, true)
        toggle(true);
    }

    return (
        <div id={attr + "-picker"} className={styles.colorPicker} style={{ backgroundColor: color }}
            onClick={() => togglePicker(!isOpen)}>
            {isOpen &&
                <SketchPicker
                    className={styles.picker}
                    style={{ position: 'fixed' }}
                    color={color}
                    onChange={(c) => setColor(c)}
                    onChangeComplete={(c) => setColor(c)} />}
        </div>
    )
}
