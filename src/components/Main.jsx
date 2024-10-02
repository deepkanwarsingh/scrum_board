import React, { useContext, useState } from 'react';
import { MoreHorizontal, UserPlus, Edit2, Trash2, Check } from 'react-feather';
import CardAdd from './CardAdd';
import { BoardContext } from '../context/BoardContext';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import AddList from './AddList';
import Utils from '../utils/Utils';

const Main = () => {
  const { allboard, setAllBoard } = useContext(BoardContext);
  const bdata = allboard.boards[allboard.active];

  const [editCard, setEditCard] = useState(null); // State to manage card being edited
  const [editList, setEditList] = useState(null); // State to manage list being edited
  const [cardValue, setCardValue] = useState(''); // Temporary state to store the edited card value
  const [listValue, setListValue] = useState(''); // Temporary state to store the edited list title

  // Handle card dragging
  function onDragEnd(res) {
    if (!res.destination) {
      console.log("No Destination");
      return;
    }

    const newList = [...bdata.list];
    const s_id = parseInt(res.source.droppableId);
    const d_id = parseInt(res.destination.droppableId);
    const [removed] = newList[s_id - 1].items.splice(res.source.index, 1);
    newList[d_id - 1].items.splice(res.destination.index, 0, removed);

    let board_ = { ...allboard };
    board_.boards[board_.active].list = newList;
    setAllBoard(board_);
  }

  // Add new card
  const cardData = (e, ind) => {
    let newList = [...bdata.list];
    newList[ind].items.push({ id: Utils.makeid(5), title: e });

    let board_ = { ...allboard };
    board_.boards[board_.active].list = newList;
    setAllBoard(board_);
  };

  // Remove a card
  const removeCard = (listIndex, cardIndex) => {
    let newList = [...bdata.list];
    newList[listIndex].items.splice(cardIndex, 1);

    let board_ = { ...allboard };
    board_.boards[board_.active].list = newList;
    setAllBoard(board_);
  };

  // Add a new list
  const listData = (e) => {
    let newList = [...bdata.list];
    newList.push({ id: newList.length + 1 + '', title: e, items: [] });

    let board_ = { ...allboard };
    board_.boards[board_.active].list = newList;
    setAllBoard(board_);
  };

  // Remove a list
  const removeList = (listIndex) => {
    let newList = [...bdata.list];
    newList.splice(listIndex, 1);

    let board_ = { ...allboard };
    board_.boards[board_.active].list = newList;
    setAllBoard(board_);
  };

  // Enable card editing
  const handleCardEdit = (listIndex, cardIndex, title) => {
    setEditCard({ listIndex, cardIndex }); // Set the card being edited
    setCardValue(title); // Set the card value in the state
  };

  // Save the edited card
  const saveCardEdit = (listIndex, cardIndex) => {
    let newList = [...bdata.list];
    newList[listIndex].items[cardIndex].title = cardValue; // Update the card title

    let board_ = { ...allboard };
    board_.boards[board_.active].list = newList;
    setAllBoard(board_);

    setEditCard(null); // Reset edit state
  };

  // Enable list editing
  const handleListEdit = (listIndex, title) => {
    setEditList(listIndex); // Set the list being edited
    setListValue(title); // Set the list title in the state
  };

  // Save the edited list
  const saveListEdit = (listIndex) => {
    let newList = [...bdata.list];
    newList[listIndex].title = listValue; // Update the list title

    let board_ = { ...allboard };
    board_.boards[board_.active].list = newList;
    setAllBoard(board_);

    setEditList(null); // Reset edit state
  };

  return (
    <div className='flex flex-col w-full' style={{ backgroundColor: `${bdata.bgcolor}` }}>
      {/* Board Header */}
      <div className='p-3 bg-black flex justify-between w-full bg-opacity-50'>
        <h2 className='text-lg'>{bdata.name}</h2>
        <div className='flex items-center justify-center'>
          <button className='bg-gray-200 h-8 text-gray-800 px-2 py-1 mr-2 rounded flex justify-center items-center'>
            <UserPlus size={16} className='mr-2' />
            Share
          </button>
          <button className='hover:bg-gray-500 px-2 py-1 h-8 rounded'>
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className='flex flex-col w-full flex-grow relative'>
        <div className='absolute mb-1 pb-2 left-0 right-0 top-0 bottom-0 p-3 flex overflow-x-scroll overflow-y-hidden'>
          <DragDropContext onDragEnd={onDragEnd}>
            {bdata.list &&
              bdata.list.map((x, ind) => {
                return (
                  <div key={ind} className='mr-3 w-60 h-fit rounded-md p-2 bg-black flex-shrink-0'>
                    <div className='list-body'>
                      <div className='flex justify-between p-1'>
                        {/* List Title (Editable if in edit mode) */}
                        {editList === ind ? (
                          <input
                            value={listValue}
                            onChange={(e) => setListValue(e.target.value)}
                            className='p-1 w-full rounded-md'
                          />
                        ) : (
                          <span>{x.title}</span>
                        )}
                        <div className='flex'>
                          {/* Save or Edit List Button */}
                          {editList === ind ? (
                            <button onClick={() => saveListEdit(ind)} className='hover:bg-gray-500 p-1 rounded-sm'>
                              <Check size={16} />
                            </button>
                          ) : (
                            <button onClick={() => handleListEdit(ind, x.title)} className='hover:bg-gray-500 p-1 rounded-sm'>
                              <Edit2 size={16} />
                            </button>
                          )}
                          {/* Remove List Button */}
                          <button onClick={() => removeList(ind)} className='hover:bg-gray-500 p-1 rounded-sm'>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Droppable area for cards */}
                      <Droppable droppableId={x.id}>
                        {(provided, snapshot) => (
                          <div
                            className='py-1'
                            ref={provided.innerRef}
                            style={{ backgroundColor: snapshot.isDraggingOver ? '#222' : 'transparent' }}
                            {...provided.droppableProps}
                          >
                            {x.items &&
                              x.items.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <div className='item flex justify-between items-center bg-zinc-700 p-1 cursor-pointer rounded-md border-2 border-zinc-900 hover:border-gray-500'>
                                        {/* Card Title (Editable if in edit mode) */}
                                        {editCard?.listIndex === ind && editCard.cardIndex === index ? (
                                          <textarea
                                            value={cardValue}
                                            onChange={(e) => setCardValue(e.target.value)}
                                            className='p-1 w-full rounded-md'
                                            rows={2}
                                          />
                                        ) : (
                                          <span>{item.title}</span>
                                        )}
                                        <span className='flex justify-start items-start'>
                                          {/* Save or Edit Card Button */}
                                          {editCard?.listIndex === ind && editCard.cardIndex === index ? (
                                            <button
                                              onClick={() => saveCardEdit(ind, index)}
                                              className='hover:bg-gray-600 p-1 rounded-sm'
                                            >
                                              <Check size={16} />
                                            </button>
                                          ) : (
                                            <button
                                              onClick={() => handleCardEdit(ind, index, item.title)}
                                              className='hover:bg-gray-600 p-1 rounded-sm'
                                            >
                                              <Edit2 size={16} />
                                            </button>
                                          )}
                                          {/* Remove Card Button */}
                                          <button onClick={() => removeCard(ind, index)} className='hover:bg-gray-600 p-1 rounded-sm'>
                                            <Trash2 size={16} />
                                          </button>
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}

                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      {/* Add new card */}
                      <CardAdd getcard={(e) => cardData(e, ind)} />
                    </div>
                  </div>
                );
              })}
          </DragDropContext>

          {/* Add new list */}
          <AddList getlist={(e) => listData(e)} />
        </div>
      </div>
    </div>
  );
};

export default Main;
