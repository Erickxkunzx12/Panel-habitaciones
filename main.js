const panels = document.querySelectorAll('.panel');
const colorSelector = document.getElementById('colorSelector');
const colorPicker = document.getElementById('colorPicker');
const socket = new WebSocket('ws://localhost:8080');

socket.onopen = () => console.log('Conectado al servidor WebSocket');

let currentPanel = null;

panels.forEach((panel) => {
    panel.addEventListener('click', (event) => {
        currentPanel = panel;

        // Muestra el selector de color al lado del panel clicado
        colorSelector.style.display = 'block';
        colorSelector.style.top = `${event.clientY}px`;
        colorSelector.style.left = `${event.clientX}px`;
    });
});

colorPicker.addEventListener('change', () => {
    if (currentPanel) {
        const id = currentPanel.id.split('-')[1];
        const estado = colorPicker.value;
        currentPanel.dataset.estado = estado;
        currentPanel.style.backgroundColor = getColor(estado);
        console.log(`Panel ${id} actualizado a estado ${estado}`);

        // Si el estado es rojo (2), mostrar la hora actual
        let time = '';
        if (estado === '2') {
            time = new Date().toLocaleTimeString();
            document.getElementById(`panel-time-${id}`).textContent = time;
        } else {
            document.getElementById(`panel-time-${id}`).textContent = '';
        }

        socket.send(JSON.stringify({ id, estado, time }));

        // Ocultar selector de color después de seleccionar
        colorSelector.style.display = 'none';

        // Reiniciar el selector de color
        colorPicker.value = ''; // Restablece el valor del selector de color
        currentPanel = null;    // Reinicia el panel actual después de la selección
    }
});

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
