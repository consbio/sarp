import { Map, List } from "immutable"

import { SET_BOUNDS, SET_LOCATION } from "../actions/map"
import { SARP_BOUNDS } from "../constants"

const initialState = Map({
    bounds: List(SARP_BOUNDS),
    location: Map() // {latitude, longitude, timestamp}
})

export const reducer = (state = initialState, { type, payload = {} }) => {
    switch (type) {
        case SET_BOUNDS: {
            return state.set("bounds", List(payload.bounds))
        }
        case SET_LOCATION: {
            return state.set("location", Map(payload.location))
        }
        default: {
            return state
        }
    }
}

export default reducer
