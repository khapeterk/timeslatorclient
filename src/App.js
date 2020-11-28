import './App.css';
import moment from 'moment-timezone';
import { useState } from 'react';

const cardStyle = { display: 'inline-grid', border: '1px solid black', borderRadius: '10px', padding: '10px', gridTemplateColumns: '1fr 1fr auto' };
const cardHeadersStyle = { fontSize: 'medium', textAlign: 'center', padding: '0 10px' };
const cardContentsStyle = { fontSize: 'x-large', textAlign: 'center', padding: '0 10px' };

function App() {
    const [showMoreZones, setShowMoreZones] = useState(false);
    const toggleShowMoreZones = () => {
        setShowMoreZones(!showMoreZones);
    }

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', maxWidth: '1980px' }}>
                <div></div>
                <RenderMoreZonesButton toggleShowMoreZones={toggleShowMoreZones} showMoreZones={showMoreZones} />
            </div>
            <DisplayZones showMoreZones={showMoreZones} />
        </div>
    );
}

function DisplayZones(props) {
    let { showMoreZones } = props;

    const fullZoneList = moment.tz.zonesForCountry('US').sort(arraySortCompareOffsets);
    const [moreZones, setMoreZones] = useState(new Set(fullZoneList));
    const [addedZones, setAddedZones] = useState(new Set());
    const currentTimeZone = moment.tz.guess();

    if (addedZones.size < 1) {
        const addedZonesInStorage = localStorage.getItem('addedZones');
        if (addedZonesInStorage) {
            setAddedZones(new Set(JSON.parse(addedZonesInStorage)));
            const newMoreZones = new Set(moreZones);
            JSON.parse(addedZonesInStorage).forEach((zone) => {
                newMoreZones.delete(zone);
            })
            setMoreZones(newMoreZones);
        } else {
            const newAddedZones = new Set(addedZones);
            newAddedZones.add('UTC');
            newAddedZones.add(currentTimeZone);
            setAddedZones(newAddedZones);

            const newMoreZones = new Set(moreZones);
            newMoreZones.delete('UTC');
            newMoreZones.delete(currentTimeZone);
            setMoreZones(newMoreZones);

            updateLocalStorage(newAddedZones);
        }
    }

    const addZone = (selectedZone) => {
        const newAddedZones = new Set(addedZones);
        newAddedZones.add(selectedZone);
        setAddedZones(newAddedZones);

        const newAmericanZones = new Set(moreZones);
        newAmericanZones.delete(selectedZone);
        setMoreZones(newAmericanZones);

        updateLocalStorage(newAddedZones);
    }

    const removeZone = (selectedZone) => {
        const newAmericanZones = new Set(moreZones);
        newAmericanZones.add(selectedZone);
        setMoreZones(newAmericanZones);

        const newAddedZones = new Set(addedZones);
        newAddedZones.delete(selectedZone);
        setAddedZones(newAddedZones);

        updateLocalStorage(newAddedZones);
    }

    return (
        <div style={{ display: 'flex', width: '100%', maxWidth: '1980px', alignItems: 'stretch' }}>
            <div style={{ flex: '1 1' }}>
                <DisplayAddedZones 
                    addedZones={addedZones} 
                    removeZone={removeZone} 
                    fullZoneList={fullZoneList}
                    currentTimeZone={currentTimeZone}
                />
            </div>
            <div style={{ flex: '1 1' }}>
                <DisplayMoreZones moreZones={moreZones} showMoreZones={showMoreZones} addZone={addZone} />
            </div>
        </div>
    )
}

function arraySortCompareOffsets(a, b) {
    if (moment().tz(a).utcOffset() < moment().tz(b).utcOffset()) {
        return 1;
    }
    if (moment().tz(a).utcOffset() > moment().tz(b).utcOffset()) {
        return -1;
    }
    return 0;
}

function updateLocalStorage(addedZones) {
    if (addedZones.size === 0) {
        localStorage.removeItem('addedZones');
    }
    if (addedZones.size > 0) {
        localStorage.setItem('addedZones', JSON.stringify(Array.from(addedZones)));
    }
}

function RenderMoreZonesButton(props) {
    const buttonStyle = { fontSize: 'large' };
    const { toggleShowMoreZones, showMoreZones } = props;
    const ShowHide = showMoreZones ? 'Hide' : 'Show';
    return (
        <button style={buttonStyle} onClick={toggleShowMoreZones}>{ShowHide} More Zones</button>
    )
}



function DisplayAddedZones(props) {
    let { addedZones, removeZone, fullZoneList, currentTimeZone } = props;
    const [ timeZone, setTimeZone ] = useState(currentTimeZone);
    const [ dateTime, setDateTime ] = useState(new Date().toISOString());
    const addedZonesComponents = [];
    for (const zone of addedZones.values()) {
        const removeZoneOnClick = () => { removeZone(zone); }
        addedZonesComponents.push(
            <DisplayAddedZone key={zone} dateTime={dateTime} timeZone={timeZone} zone={zone} removeZoneOnClick={removeZoneOnClick} />
        )
    }
    const zoneListOptions = [];
    fullZoneList.forEach((zone) => {
        zoneListOptions.push(<option key={zone} value={zone}>{zone}</option>)
    })
    const handleZoneChange = (event) => {
        setTimeZone(event.target.value);
    }
    const handleDateTimeChange = (event) => {
        setDateTime(event.target.value);
    }
    return (
        <div style={{ display: 'grid' }}>
            <div style={cardStyle}>
                <div>
                    <div style={cardHeadersStyle}>Select Zone</div>
                    <div style={cardContentsStyle}>
                        <select defaultValue={timeZone} onChange={handleZoneChange} >
                            {zoneListOptions}
                        </select>
                    </div>
                </div>
                <div>
                    <div style={cardHeadersStyle}>Enter Time</div>
                    <div style={cardContentsStyle}>
                        <input type="datetime-local" onChange={handleDateTimeChange} />
                    </div>
                </div>
            </div>
            {addedZonesComponents}
        </div>
    )
}

function DisplayAddedZone(props) {
    const { dateTime, timeZone, zone, removeZoneOnClick } = props;
    const dateTimeInZone = moment.tz(dateTime, timeZone).tz(zone);
    return (
        <div style={cardStyle}>
            <div>
                <div style={cardHeadersStyle}>Zone</div>
                <div style={cardContentsStyle}>{zone}</div>
            </div>
            <div>
                <div style={cardHeadersStyle}>Time</div>
                <div style={cardContentsStyle}>{dateTimeInZone.format('lll')}</div>
            </div>
            <div>
                <button onClick={removeZoneOnClick}>X</button>
            </div>
        </div>
    )
}

function DisplayMoreZones(props) {
    const { moreZones, addZone } = props;
    const zones = [];
    for (const zone of moreZones.values()) {
        const addZoneOnClick = () => { addZone(zone); }
        zones.push(
            <DisplayMoreZone key={zone} zone={zone} addZoneOnClick={addZoneOnClick} />
        )
    }
    if (!props.showMoreZones) return (<></>)
    return (
        <div style={{ display: 'grid' }}>
            {zones}
        </div>
    )
}

function DisplayMoreZone(props) {
    const { zone, addZoneOnClick } = props;

    return (
        <div style={cardStyle}>
            <div>
                <div style={cardHeadersStyle}>Zone</div>
                <div style={cardContentsStyle}>{zone}</div>
            </div>
            <div>
                <div style={cardHeadersStyle}>Offset</div>
                <div style={cardContentsStyle}>{moment().tz(zone).utcOffset() / 60}</div>
            </div>
            <div>
                <button onClick={addZoneOnClick}>+</button>
            </div>
        </div>
    )
}

export default App;
