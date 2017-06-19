import moment from 'moment';

const baseUrl = 'https://www.googleapis.com/calendar/v3';

export function insertEvents(event) {
    let url = `${baseUrl}/calendars/primary/events`;

    console.log(`Making POST request to: ${url}`);

    return fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...event
        })
    }).then((res) => {
        if (res.status !== 200)
            throw new Error(`Unexpected response code: ${res.status}`);

        return res.json();
    });
}

export function updateEvents(event, eventID) {
    let url = `${baseUrl}/calendars/primary/events/${eventID}`;

    console.log(`Making POST request to: ${url}`);

    return fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...event
        })
    }).then((res) => {
        if (res.status !== 200)
            throw new Error(`Unexpected response code: ${res.status}`);

        return res.json();
    });
}

export function getDay(userId, year, month, day) {
    let startTime = moment({year, month:month-1, day}).format('YYYY-MM-DD ZZ');
    let endTime = moment({year, month:month-1, day});
    endTime = endTime.date(day+1).format('YYYY-MM-DD ZZ');
    let url = `${baseUrl}/calendars/primary/events?timeMin=${encodeURIComponent(startTime)}&timeMax=${encodeURIComponent(endTime)}`;

    console.log(`Making GET request to: ${url}`);

    return fetch(url, {
        headers: {
            'Accept': 'application/json'
        }
    }).then((res) => {
        if (res.status !== 200)
            throw new Error(`Unexpected response code: ${res.status}`);

        return res.json();
    });
}

export function getEvent(userId) {
    let url = `${baseUrl}/calendars/primary/events`;

    console.log(`Making GET request to: ${url}`);

    return fetch(url, {
        headers: {
            'Accept': 'application/json'
        }
    }).then((res) => {
        if (res.status !== 200)
            throw new Error(`Unexpected response code: ${res.status}`);

        return res.json();
    });
}
