import { useState } from 'react';
import { cardStyle, cardHeadersStyle, cardContentsStyle } from './styles';
import { buildMomentZone, getUSTimeZones } from './utils';

function DisplayAddedZones(props) {
    let { addedZones, removeZone, currentTimeZone } = props;
    const [timeZone, setTimeZone] = useState(currentTimeZone);
    const [dateTime, setDateTime] = useState(new Date().toISOString());
    const addedZonesComponents = [];
    for (const targetZone of addedZones.values()) {
        const removeZoneOnClick = () => { removeZone(targetZone); }
        addedZonesComponents.push(
            <DisplayAddedZone key={targetZone} newMoment={buildMomentZone(dateTime, timeZone)} targetZone={targetZone} removeZoneOnClick={removeZoneOnClick} />
        )
    }
    return (
        <div style={{ display: 'grid' }}>
            <SelectDateTimeZone timeZone={timeZone} setTimeZone={setTimeZone} setDateTime={setDateTime}/>
            {addedZonesComponents}
        </div>
    )
}

function SelectDateTimeZone(props) {
    const { setTimeZone, setDateTime, timeZone} = props;
    const zoneListOptions = [];
    const fullZoneList = getUSTimeZones();
    fullZoneList.forEach((zone) => {
        zoneListOptions.push(<option key={zone} value={zone}>{zone}</option>);
    })
    const handleZoneChange = (event) => {
        setTimeZone(event.target.value);
    }
    const handleDateTimeChange = (event) => {
        setDateTime(event.target.value);
    }
    return (
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

export default DisplayAddedZones;