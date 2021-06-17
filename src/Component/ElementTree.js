import { useStores } from '../states/Context';
import { observer } from 'mobx-react';
import styles from '../static/css/ElementTree.module.css';

import sectionImg from '../static/images/section.svg';
import textImg from '../static/images/text.svg';
import buttonImg from '../static/images/button.svg';
import imageImg from '../static/images/image.svg';
import videoImg from '../static/images/video.svg';

import { useState, useRef } from 'react';
import { SpaceBetweenLayout } from './UtilComponents';
import { HiChevronRight } from "react-icons/hi";
import { HiChevronDown } from "react-icons/hi";
import {
    dragStart,
    dragOver,
    dragEnter,
    dragLeave,
    drop,

    betweenDrop,
} from "../controller/tree";

const BetweenButton = observer(({ element, depth, location }) => {
    const { elementStore } = useStores();
    const ref = useRef(null);
    return (
        <div

            ref={ref}
            className={styles.betweenButton}
            onDragOver={(e) => dragOver(e)}
            onDragEnter={() => dragEnter(ref)}
            onDragLeave={() => dragLeave(ref)}
            onDrop={(e) => betweenDrop(e, ref, elementStore, element, location)}
            data-id={element.id}
            data-type="between"

        >

        </div>
    )
})

const ElementButton = observer(({ element, depth }) => {
    const { elementStore } = useStores();

    const ref = useRef(null);
    let iconImage;

    switch (element.tag) {
        case 'section':
            iconImage = sectionImg;
            break;
        case 'text':
            iconImage = textImg;
            break;
        case 'button':
            iconImage = buttonImg;
            break;
        case 'image':
            iconImage = imageImg;
            break;
        case 'video':
            iconImage = videoImg;
            break;
        default:
            iconImage = sectionImg;
            break;
    }

    return (
        <button
            ref={ref}
            className={[
                styles.elementButton,
                element.isSelect ? styles.selected : ''
            ].join(' ')}
            style={{ paddingLeft: 10 + depth * 15 }}
            onClick={() => { elementStore.select(element) }}
            onDragStart={() => dragStart(ref)}
            onDragOver={(e) => dragOver(e)}
            onDragEnter={() => dragEnter(ref)}
            onDragLeave={() => dragLeave(ref)}
            onDrop={(e) => drop(e, ref, elementStore)}
            draggable
            data-id={element.id}
            data-tag={element.tag}
        >
            <span>
                <img className={styles.treeIcon} src={iconImage} alt="" />
                {element.id}
            </span>
        </button>
    )
})

const ToggleChildElementsButton = observer(({ isOpen, toggle, children }) => {
    if (children === undefined) return <></>
    if (!children.length) return <></>

    return (
        <button className={[
            styles.toggleButton,
            isOpen ? styles.opened : styles.closed
        ].join(' ')}
            onClick={() => toggle(!isOpen)}>
            {isOpen ? <HiChevronDown /> : <HiChevronRight />}
        </button>
    )
})

const ChildElements = observer(({ elementStore, isOpen, children, depth }) => {
    if (!isOpen) return <></>
    if (children === undefined) return <></>
    return (
        children.map((child) => {
            return <SimpleElement
                elementStore={elementStore}
                key={child.id}
                element={child}
                depth={depth + 1} />
        })
    )
})

const SimpleElement = observer(({ elementStore, element, depth }) => {

    const [isOpen, toggle] = useState(false);
    const children = element.children;

    return (
        <div className={styles.tree}>
            <BetweenButton
                element={element}
                depth={depth}
                location="top"
            />
            <SpaceBetweenLayout align="center">

                <ElementButton
                    elementStore={elementStore}
                    element={element}
                    depth={depth} />
                <ToggleChildElementsButton
                    isOpen={isOpen}
                    children={children}
                    toggle={toggle} />
            </SpaceBetweenLayout>

            <ChildElements
                elementStore={elementStore}
                isOpen={isOpen}
                children={children}
                depth={depth} />
            <BetweenButton
                element={element}
                depth={depth}
                location="bottom"
            />


        </div>
    )
})


export default observer(() => {
    const { elementStore } = useStores();

    return (
        <div className={styles.treeContainer}>
            { elementStore.children &&
                elementStore.children.map((element, index) => {
                    return <SimpleElement
                        elementStore={elementStore}
                        key={element.id}
                        element={element}
                        depth={0} />
                })
            }
        </div>
    )

})