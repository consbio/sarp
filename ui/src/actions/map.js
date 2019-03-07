export const SET_BOUNDS = "SET_BOUNDS"
export const setBounds = bounds => ({
    type: SET_BOUNDS,
    payload: {
        bounds
    }
})

export const SET_LOCATION = "SET_LOCATION"
export const setLocation = location => ({
    type: SET_LOCATION,
    payload: {
        location
    }
})
