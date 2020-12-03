import moment from 'moment-timezone';

function arraySortCompareOffsets(a, b) {
    if (moment().tz(a).utcOffset() < moment().tz(b).utcOffset()) {
        return 1;
    }
    if (moment().tz(a).utcOffset() > moment().tz(b).utcOffset()) {
        return -1;
    }
    return 0;
}

function buildMomentZone(dateTime, timeZone) {
    return moment.tz(dateTime, timeZone);
}

function getUSTimeZones() {
    return moment.tz.zonesForCountry('US').sort(arraySortCompareOffsets);
}

function getZoneOffset(zone) {
    return moment().tz(zone).utcOffset() / 60;
}

function guessCurrentTimeZone() {
    return moment.tz.guess();
}

function updateLocalStorage(addedZones) {
    if (addedZones.size === 0) {
        localStorage.removeItem('addedZones');
    }
    if (addedZones.size > 0) {
        localStorage.setItem('addedZones', JSON.stringify(Array.from(addedZones)));
    }
}

export { 
    buildMomentZone,
    getUSTimeZones,
    getZoneOffset,
    guessCurrentTimeZone,
    updateLocalStorage 
};