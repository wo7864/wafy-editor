import { waitFor } from '@testing-library/dom';
import { ElementStore } from '../states/ElementStore'
import Move from '../states/Move'

const elementStore = new ElementStore();
elementStore.add({tag:'section'})
elementStore.add({tag:'text'})
test('move', async () => {
    const elements = elementStore.children
    const mouse = {
        clientX:240,
        clientY:405,
    }
    const move = new Move({
        children: elementStore.children,
        add: elementStore.add,
        remove: elementStore.remove,
    })
    move.init(elements[1], mouse)
    await waitFor( ()=>{
        move.move({
            clientX:260,
            clientY:291,
        })
    }) 
    move.end()
    expect(elements).toHaveLength(1);
    
});
