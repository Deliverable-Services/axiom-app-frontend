// - Order the data as per the passed key
const orderBy = (data, key) => 
                    data.concat().sort((a, b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0));

export default orderBy;