const cardStyle = {
    display: 'inline-grid',
    border: '1px solid black',
    borderRadius: '10px', 
    padding: '10px', 
    gridTemplateColumns: '1fr 1fr auto'
};

const cardHeadersStyle = { 
    fontSize: 'medium', 
    textAlign: 'center', 
    padding: '0 10px' 
};

const cardContentsStyle = { 
    fontSize: 'x-large', 
    textAlign: 'center', 
    padding: '0 10px' 
};

export {
    cardStyle,
    cardHeadersStyle,
    cardContentsStyle
}