import React from 'react'
const REACT_APP_API_URL = "/api"

const ShowImage = ({ item, url }) => (
    <div className="product-img">
        <img src={`${REACT_APP_API_URL}/${url}/photo/${item._id}`} alt={item.name}
            className="mb-3" style={{ maxHeight: "100%", maxWidth: "100% " }} />
    </div>
)

export default ShowImage