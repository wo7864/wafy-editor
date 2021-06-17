import { useStores } from '../states/Context';
import { observer } from 'mobx-react';
import ElementComponent from './ElemComponent';
import { useEffect, useRef } from 'react';
import '../static/css/Stage.css';

const ContextMenu = observer(({ elementStore }) => {
    const { windowStore } = useStores();
    const ref = useRef(null);
    useEffect(() => {
        if(!ref.current) return;
        if(ref.current.offsetTop + ref.current.offsetHeight > window.innerHeight){
            ref.current.style.transform = `translateY(-${ref.current.offsetHeight}px)`
            console.log(ref.current);
        }

        return () => {
        }
    },[])
    return (
        <>
            {elementStore.selectedElem ?
                <elementStore.selectedElem.ContextMenu
                    ref={ref}
                    elementStore={elementStore}
                    windowStore={windowStore} /> :
                <elementStore.ContextMenuComponent elementStore={elementStore} />}
        </>
    )
})

export default observer(() => {

    const { elementStore, stageStore } = useStores();

    const stageRef = useRef(null)
    useEffect(() => {
        stageRef.current.addEventListener('scroll', e => {
            stageStore.setScroll(e.target.scrollTop)
        })
        
        stageRef.current.addEventListener('dragstart', (e)=>{
            e.preventDefault();
        })

        return () => {}
    },[stageStore])

    return (
        <div className="stage-container">

            <div className={`stage-width-controller left 
            ${stageStore.isResizing ? 'resizing' : ''}`}
                style={{ height: stageStore.height }}
                onMouseDown={(e) => stageStore.startResize(e, 'left')} />


            <div id="stage" className="stage" ref={stageRef}
                role="list"
                style={{
                    width: stageStore.width,
                    height: stageStore.height,
                }}
                onMouseDown={(e) => elementStore.deselect(e)}
                onContextMenu={(e) => elementStore.contextMenu(e)}>
                {
                    elementStore.children &&
                    elementStore.children.map((element, index) => {
                        return <ElementComponent
                            key={element.id}
                            element={element} />
                    })
                }

                {elementStore.isContextMenu &&
                    <ContextMenu elementStore={elementStore} />}

            </div>
            
            <div className={`stage-width-controller right 
            ${stageStore.isResizing ? 'resizing' : ''}`}
                style={{ height: stageStore.height }}
                onMouseDown={(e) => stageStore.startResize(e, 'right')} />

        </div>
    )
})
