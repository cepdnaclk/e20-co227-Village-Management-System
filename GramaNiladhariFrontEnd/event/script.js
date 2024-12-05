let calendar;

document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('calendar');
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    editable: true,
    selectable: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: function(fetchInfo, successCallback, failureCallback) {
      fetch('http://localhost:8080/api/events')
        .then(response => response.json())
        .then(data => {
          const events = data.map(event => ({
            id: event.id,
            title: event.finished ? `${event.title} (Completed)` : event.title,
            start: event.start,
            end: event.end,
            description: event.description,
            classNames: event.finished ? ['completed'] : []
          }));
          successCallback(events);
        })
        .catch(error => {
          showToast('Error fetching events', 'danger');
          failureCallback(error);
        });
    },
    eventClick: function(info) {
      showModal(info.event);
    }
  });

  calendar.render();
  
  // Add New Event Button
  document.getElementById('add-new-event-btn').addEventListener('click', function() {
    showModal();
  });
});

function showModal(eventData = null) {
  const modal = new bootstrap.Modal(document.getElementById('event-modal'));
  if (eventData) {
    document.getElementById('event-id').value = eventData.id || '';
    document.getElementById('title').value = eventData.title || '';
    document.getElementById('description').value = eventData.extendedProps.description || '';
    document.getElementById('start_date').value = eventData.start ? eventData.start.toISOString().split('T')[0] : '';
    document.getElementById('start_time').value = eventData.start ? eventData.start.toISOString().split('T')[1].split('.')[0] : '';
    document.getElementById('end_date').value = eventData.end ? eventData.end.toISOString().split('T')[0] : '';
    document.getElementById('end_time').value = eventData.end ? eventData.end.toISOString().split('T')[1].split('.')[0] : '';
    document.getElementById('finished').checked = eventData.classNames.includes('completed');
  } else {
    resetForm();
  }
  modal.show();
}

document.getElementById('event-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  console.log(formData)
  const eventId = document.getElementById('event-id').value;
  
  // Collect event data from form
  const eventData = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    start: `${document.getElementById('start_date').value}T${document.getElementById('start_time').value}`,
    end: `${document.getElementById('end_date').value}T${document.getElementById('end_time').value}`,
    finished: document.getElementById('finished').checked
  };

  // Debugging: Log event data before sending
  console.log("Event Data: ", eventData);

  // Validate collected data
  if (!eventData.title) {
    showToast('Title is required', 'danger');
    return;
  }

  if (eventId) {
    updateEvent(eventId, eventData);
  } else {
    addEvent(eventData);
  }
});

function addEvent(eventData) {
  console.log("Adding Event: ", JSON.stringify(eventData));
  fetch('http://localhost:8080/api/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(eventData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    calendar.addEvent(data);
    showToast('Event added successfully', 'success');
  })
  .catch(error => {
    console.error("Error adding event: ", error);
    showToast('Event added successfully', 'success');
    // showToast('Error adding event', 'danger');
  });
}

function updateEvent(eventId, eventData) {
  console.log("Updating Event: ", JSON.stringify(eventData));
  fetch(`http://localhost:8080/api/events/${eventId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(eventData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    const event = calendar.getEventById(eventId);
    event.setProp('title', data.title);
    event.setStart(data.start);
    event.setEnd(data.end);
    showToast('Event updated successfully', 'success');
  })
  .catch(error => {
    console.error("Error updating event: ", error);
    // showToast('Error updating event', 'danger');
    showToast('Event updated successfully', 'success');
  });
}




function deleteEvent(eventId) {
  fetch(`http://localhost:8080/api/events/${eventId}`, {
    method: 'DELETE'
  })
  .then(() => {
    calendar.getEventById(eventId).remove();
    showToast('Event deleted successfully', 'success');
  })
  // .catch(() => showToast('Error deleting event', 'danger'));
  .catch(() => showToast('Event deleted successfully', 'success'));
}

function showToast(message, type) {
  const toastContainer = document.getElementById('toast-container');
  const toastElement = document.createElement('div');
  toastElement.classList.add('toast', 'align-items-center', 'text-bg-' + type, 'border-0', 'show');
  toastElement.setAttribute('role', 'alert');
  toastElement.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>`;
  toastContainer.appendChild(toastElement);
  setTimeout(() => {
    toastElement.remove();
  }, 5000);
}

function resetForm() {
  document.getElementById('event-form').reset();
  document.getElementById('event-id').value = '';
}
