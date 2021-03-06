const url = 'http://localhost:3000';
const socket = io();
const id = window.location.pathname.replace('/device/', '');

socket.on('on', () => {
    console.log('haha');
});

socket.on('sendFromDevice', async (statusChange, deviceId) => {
    console.log(deviceId === id);
    if (deviceId === id) {
        // const currentTime = await new Date().toUTCString();

        // const historyActions = await document.getElementById('history');
        // historyActions.innerHTML =
        //     `<p>Device turn: <strong>${statusChange ? 'ON' : 'OFF'}</strong> at ${currentTime}</p>` +
        //     historyActions.innerHTML;
        document.getElementById('check').remove();
        document.querySelector('.switch').innerHTML =
            `<input type="checkbox" onchange="change(this)" id="check" ${statusChange ? 'checked' : ''}/>` +
            document.querySelector('.switch').innerHTML;
    }
});

const deviceInfo = async () => {
    const res = await (await fetch(`${url}/api/v1/device/${id}`)).json();
    document.getElementById('name').innerHTML = res.data.name;
    document.getElementById('description').innerHTML += `<p>${res.data.description}</p>`;
    document.getElementById('check').checked = res.data.deviceStatus;
};
deviceInfo();

const change = async (thisElement) => {
    const currentTime = await new Date().toUTCString();
    socket.emit('change', thisElement.checked);
    const historyActions = await document.getElementById('history');
    historyActions.innerHTML =
        `<p>Device turn: <strong>${thisElement.checked ? 'ON' : 'OFF'}</strong> at ${currentTime}</p>` +
        historyActions.innerHTML;

    axios.patch(`http://localhost:3000/api/v1/device/${id}`, {
        deviceStatus: thisElement.checked,
    });
};
