import { useState } from 'react';
import { getUSTimeZones, guessCurrentTimeZone, updateLocalStorage } from './utils';
import DisplayAddedZones from './DisplayAddedZones';
import DisplayMoreZones from './DisplayMoreZones';

function DisplayZones(props) {
    let { showMoreZones } = props;

    const fullZoneList = getUSTimeZones();
    const [moreZones, setMoreZones] = useState(new Set(getUSTimeZones()));
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

export default DisplayZones;