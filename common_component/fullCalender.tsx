import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import Modal from '@/common_component/modal'; // Assuming you have a modal component

export default function CustomFullCalendar(props) {
    const { events, setEvents, selectDate } = props;

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    console.log("currentEvent: ", currentEvent);

    const handleEventClick = (info) => {
        console.log('Event clicked', info.event.title);
        setCurrentEvent(info.event); // Set the clicked event in the state
        setModalIsOpen(true); // Open the modal
    };

    const handleUpdateEvent = () => {
        if (currentEvent) {
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event.id === currentEvent.id ? currentEvent : event
                )
            );
        }
        setModalIsOpen(false); // Close the modal after updating
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentEvent({
            ...currentEvent,
            [name]: value,
        });
    };

    return (
        <div className="calendar-wrapper">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                editable={true}
                dayMaxEvents={true}
                selectable={true}
                droppable={true}
                eventClick={handleEventClick} // Open modal on event click
                select={selectDate}
                events={events}
                height="600px"
            />

            {/* Modal for Event Details */}
            {currentEvent && (
                <Modal
                    open={modalIsOpen}
                    close={() => setModalIsOpen(false)}
                    renderComponent={() => (
                        <>
                            <h2>Edit Event</h2>
                            <label>
                                Title:
                                <input
                                    type="text"
                                    name="title"
                                    value={currentEvent.title || ''}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                Description:
                                <textarea
                                    name="description"
                                    value={currentEvent.description || ''}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                Start Date:
                                <input
                                    type="datetime-local"
                                    name="start"
                                    value={currentEvent.start
                                        ? new Date(currentEvent.start).toISOString().slice(0, 16)
                                        : ''}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                End Date:
                                <input
                                    type="datetime-local"
                                    name="end"
                                    value={currentEvent.end
                                        ? new Date(currentEvent.end).toISOString().slice(0, 16)
                                        : ''}
                                    onChange={handleChange}
                                />
                            </label>
                            <button onClick={handleUpdateEvent}>Update Event</button>
                            <button onClick={() => setModalIsOpen(false)}>Cancel</button>
                        </>
                    )}
                />
            )}
        </div>
    );
}
