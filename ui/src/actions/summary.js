export { setBounds, setCenter } from "./map"

export const SUMMARY_SET_SYSTEM = "SUMMARY_SET_SYSTEM"
export const setSystem = system => ({
    type: SUMMARY_SET_SYSTEM,
    payload: { system }
})

export const SUMMARY_SELECT_FEATURE = "SUMMARY_SELECT_FEATURE"
export const selectFeature = selectedFeature => ({
    type: SUMMARY_SELECT_FEATURE,
    payload: { selectedFeature }
})

export const SUMMARY_SET_TYPE = "SUMMARY_SET_TYPE"
export const setType = type => ({
    type: SUMMARY_SET_TYPE,
    payload: {
        type
    }
})
