import './App.css';
import { useState } from 'react';
import { buildMomentZone, getUSTimeZones, getZoneOffset, guessCurrentTimeZone, updateLocalStorage } from './utils';

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

    const fullZoneList = getUSTimeZones();
    const [moreZones, setMoreZones] = useState(new Set(fullZoneList));
    const [addedZones, setAddedZones] = useState(new Set());
    const currentTimeZone = guessCurrentTimeZone();

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
    for (const targetZone of addedZones.values()) {
        const removeZoneOnClick = () => { removeZone(targetZone); }
        addedZonesComponents.push(
            <DisplayAddedZone key={targetZone} newMoment={buildMomentZone(dateTime, timeZone)} targetZone={targetZone} removeZoneOnClick={removeZoneOnClick} />
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
    const { newMoment, targetZone, removeZoneOnClick } = props;
    const dateTimeInZone = newMoment.tz(targetZone);
    return (
        <div style={cardStyle}>
            <div>
                <div style={cardHeadersStyle}>Zone</div>
                <div style={cardContentsStyle}>{targetZone}</div>
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
                <div style={cardContentsStyle}>{getZoneOffset(zone)}</div>
            </div>
            <div>
                <button onClick={addZoneOnClick}>+</button>
            </div>
        </div>
    )
}

export default App;
