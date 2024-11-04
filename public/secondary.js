const panels = document.querySelectorAll('.panel');
const socket = new WebSocket(`wss://${location.host}`); // Use wss for secure connection

socket.onopen = () => console.log('Conectado al servidor WebSocket');

socket.onmessage = (event) => {
    const { id, estado, time } = JSON.parse(event.data);
    console.log(`Panel ${id} actualizado a estado ${estado}`);
    const panel = document.querySelector(`#panel-${id}`);
    if (panel) {
        panel.dataset.estado = estado;
        panel.style.backgroundColor = getColor(estado);
        if (estado === '2') {
            document.getElementById(`panel-time-${id}`).textContent = time;
        } else {
            document.getElementById(`panel-time-${id}`).textContent = '';
        }
    }
};

function getColor(estado) {
    switch (estado) {
        case '0':
            return 'grey';
        case '1':
            return 'green';
        case '2':
            return 'red';
        case '3':
            return 'yellow';
        default:
            return 'grey';
    }
}
