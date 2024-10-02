import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'react-feather';

const CardAdd = (props) => {
    const [card, setCard] = useState('');
    const [show, setShow] = useState(false);

    const saveCard = () => {
        if (!card) {
            return;
        }
        props.getcard(card);
        setCard('');
        setShow(!show);
    }

    const closeBtn = () => {
        setCard('');
        setShow(!show);
    }

    return (
        <div>
            <div className="flex flex-col">
                {show && (
                    <div>
                        <textarea
                            value={card}
                            onChange={(e) => setCard(e.target.value)}
                            className='p-1 w-full rounded-md border-2 bg-zinc-700 border-zinc-900'
                            name=""
                            id=""
                            cols="30"
                            rows="2"
                            placeholder='Enter Card Title...'
                        ></textarea>
                        <div className='flex p-1'>
                            <button onClick={saveCard} className='p-1 rounded bg-sky-600 text-white mr-2'>
                                Add Card
                            </button>
                            <button onClick={closeBtn} className='p-1 rounded hover:bg-gray-600'>
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                )}
                {!show && (
                    <button onClick={() => setShow(!show)} className='flex p-1 w-full justify-start rounded items-center mt-1 hover:bg-gray-500 h-8'>
                        <Plus size={16} /> Add a card
                    </button>
                )}
            </div>

            {props.cards && props.cards.map((cardText, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-200 p-2 rounded my-2">
                    <span>{cardText}</span>
                    <button onClick={() => props.removecard(index)} className='p-1 rounded hover:bg-gray-300'>
                        <Trash2 size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
}

export default CardAdd;
