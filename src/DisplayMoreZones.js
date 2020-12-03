import { cardStyle, cardHeadersStyle, cardContentsStyle } from './styles';
import { getZoneOffset } from './utils';

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

export default DisplayMoreZones;