import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { useStores } from '../states/Context';
import styles from '../static/css/Elements.module.css';

const UpdateParentArea = observer(({ element }) => {
    const { elementStore } = useStores();
    const move = elementStore.move;
    const { left, top, width, height } = element.style
    const rectStyle = {
        left: left + width / 2,
        top: top + height / 2,
        transform: 'translate(-50%,-50%)'
    }
    if (!element.isUpdateParentArea) return <></>
    return (
        <div className={styles.updateParentArea} style={rectStyle}
        onMouseEnter={() => move.setUpdateParent(element)}
        >
            <span>{element.id}</span>
            <div className={styles.hoverArea}
                
                onMouseEnter={() => move.setUpdateParent(element)}
                onMouseLeave={() => move.unSetUpdateParent()}>
                    넣기
            </div>

        </div>
    )
})

const ElemComponent = observer(({ element }) => {
    const { elementStore } = useStores();
    if (element.tag === 'image' || element.tag === 'video') {

        return (
            <div
                id={element.id} role="listitem"
                className={`${element.className} ${element.isSelect ? styles.selected : ""}`}
                style={{
                    ...element.style,
                    left: element.style.left + element.style.leftUnit,
                    top: element.style.top + element.style.topUnit,
                    width: element.style.width + element.style.widthUnit,
                    height: element.style.height + element.style.heightUnit,
                    zIndex: element.isSelect ? 5 : 0,
                    backgroundImage: element.tag === 'image' ?
                        `url("${element.src}")` : `url("${element.introSrc}")`,
                    backgroundSize: 'cover',
                }}
                onMouseDown={(e) => elementStore.select(element, e)}
                onDoubleClick={() => elementStore.dblClick()}
                onContextMenu={(e) => elementStore.contextMenu(e)}
            >

                {element.isSelect && <element.ResizeHandler elementStore={elementStore} />}
            </div>

        )
    }
    else {
        useEffect(() => {
            if (element.style.minWidth === -1) {
                element.setMinRect();
            }
        }, [element])

        return (
            <>
                <div
                    id={element.id} role="listitem"
                    className={[
                        element.className,
                        (element.isSelect && !element.contentEditable) ? styles.selected : ""
                    ].join(' ')}
                    style={{
                        ...element.style,
                        left: element.style.left + element.style.leftUnit,
                        top: element.style.top + element.style.topUnit,
                        width: element.style.width + element.style.widthUnit,
                        height: element.style.height + element.style.heightUnit,
                        zIndex: element.isSelect ? 5 : 0,
                        cursor: element.contentEditable ? 'text' : ''
                    }}
                    onMouseDown={(e) => elementStore.select(element, e)}
                    onDoubleClick={() => elementStore.dblClick()}
                    onContextMenu={(e) => elementStore.contextMenu(e)}
                >


                    {element.innerText &&
                        <div className="inner-text"
                            suppressContentEditableWarning={true}
                            contentEditable={element.contentEditable ? true : false}
                            onKeyDown={element.divToBr}
                            onInput={element.setInnerText}
                        >
                            {!element.contentEditable ?
                                element.innerText : element.tmpText}
                        </div>
                    }

                    {element.children && element.children.map(childElem => {
                        return <ElemComponent
                            key={childElem.id}
                            element={childElem} />
                    })}
                    {element.isSelect && <element.ResizeHandler elementStore={elementStore} />}

                </div>
                <UpdateParentArea element={element} />

            </>
        )
    }
})
export default ElemComponent;