import React, { useState } from "react"
import PropTypes from "prop-types"

import { SYSTEMS, SYSTEM_UNITS, STATE_FIPS } from "../constants"
import data from "../data/unit_bounds.json"

// merge state name in
data.State.forEach(s => {
    s.name = STATE_FIPS[s.id].toLowerCase()
})

// expand county name to include " County"
data.County.forEach(c => {
    c.name += " County"
})

// for HUC and ECO units, add prefix for ID
SYSTEM_UNITS.HUC.forEach(layer => {
    data[layer].forEach(item => {
        item.prefix = layer
    })
})
SYSTEM_UNITS.ECO.forEach(layer => {
    data[layer].forEach(item => {
        item.prefix = layer
    })
})

const ListItem = ({ id, name, state, prefix, showID, onClick }) => {
    const stateLabels = state
        ? state
            .split(",")
            .map(s => STATE_FIPS[s])
            .join(", ")
        : ""

    return (
        <li onClick={onClick}>
            <div className="has-text-weight-bold">
                {name}
                {showID && (
                    <span className="is-size-7 has-text-grey has-text-weight-normal no-wrap">
                        &nbsp;(
                        {prefix && `${prefix}: `}
                        {id})
                    </span>
                )}
            </div>

            {stateLabels && <div>{stateLabels}</div>}
        </li>
    )
}

ListItem.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    state: PropTypes.string,
    prefix: PropTypes.string,
    showID: PropTypes.bool
}

ListItem.defaultProps = {
    state: "",
    prefix: "",
    showID: false
}

const UnitSearch = ({ system, layer, onSelect }) => {
    const [{ value, results }, setState] = useState({ value: "", results: [] })

    let units = []
    if (layer !== null) {
        units = data[layer]
    } else {
        units = SYSTEM_UNITS[system].reduce((collector, unit) => collector.concat(data[unit]), [])
    }
    window.units = units

    const handleChange = ({ target: { value: inputValue } }) => {
        if (inputValue === "") {
            setState({
                value: inputValue,
                results: []
            })
            return
        }

        // Filter out the top 10
        const expr = new RegExp(value, "gi")
        const filtered = units.filter(item => item.name.search(expr) !== -1 || item.id.search(expr) !== -1)
        setState({ value: inputValue, results: filtered.slice(0, 10) })
    }

    const showID = system !== "ADM"
    const searchLabel = `${SYSTEMS[system].toLowerCase()} name${system !== "ADM" ? " or ID" : ""}`

    return (
        <div id="UnitSearch">
            <h5 className="is-size-5">Search for {SYSTEMS[system].toLowerCase()}:</h5>
            <input className="input" type="text" placeholder={searchLabel} onChange={handleChange} />
            {value !== "" && (
                <>
                    {results.length > 0 ? (
                        <ul>
                            {results.map(item => (
                                <ListItem
                                    key={item.id}
                                    {...item}
                                    showID={showID}
                                    onClick={() => onSelect(item.id, item.bbox)}
                                />
                            ))}
                        </ul>
                    ) : (
                        <div className="has-text-grey text-align-center" style={{ margin: "1em 0" }}>
                            No results match your search
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

UnitSearch.propTypes = {
    system: PropTypes.string.isRequired,
    layer: PropTypes.string,
    onSelect: PropTypes.func
}

UnitSearch.defaultProps = {
    layer: null,
    onSelect: (id, bbox) => {
        console.log(`onSelect ${id} ${bbox}`)
    }
}

export default UnitSearch
