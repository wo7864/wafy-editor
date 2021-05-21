import { render, fireEvent, screen, createEvent } from '@testing-library/react'
import Stage from '../component/Stage';
import Tool from '../component/Tool';
import { useStores } from '../states/Context';


render(<Tool/>)
render(<Stage/>)
fireEvent.click(screen.getByRole('menuitem'))
fireEvent.click(screen.getByRole('menuitem'))
fireEvent.click(screen.getByRole('menuitem'))

const stage = screen.getByRole('list')

test(`add // select // deselect`, () => {
    
    const { elementStore } = useStores();

    expect(stage.childNodes).not.toHaveLength(0);
    
    const elements = screen.getAllByRole('listitem')
    fireEvent.mouseDown(elements[0])
    fireEvent.mouseUp(elements[1])


    expect(stage.childNodes).toHaveLength(2);

    expect(elements[0].classList.contains('selected')).toBe(true);
    expect(elements[2].classList.contains('selected')).toBe(false);

});

