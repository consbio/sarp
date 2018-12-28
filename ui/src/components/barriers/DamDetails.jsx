import React from "react"
import PropTypes from "prop-types"

import { formatNumber } from "../../utils/format"

import { DAM_CONDITION, CONSTRUCTION, PURPOSE, RECON, SINUOSITY } from "../../constants"

const DamDetails = ({
    lat,
    lon,
    hasnetwork,
    height,
    year,
    construction,
    purpose,
    condition,
    river,
    basin,
    rarespp,
    recon,
    // metrics
    gainmiles,
    upstreammiles,
    downstreammiles,
    sinuosity,
    landcover,
    sizeclasses
}) => (
    <div id="BarrierDetails">
        <h6 className="title is-6">Location</h6>
        <ul>
            <li>
                Coordinates: {formatNumber(lon, 3)}
                &deg; W / {formatNumber(lat, 3)}
                &deg; N
            </li>
            <li>
                {river && river !== "null" && river !== "Unknown" ? `${river}, ` : null}
                {basin} Basin
            </li>
        </ul>

        <h6 className="title is-6">Construction information</h6>
        <ul>
            <li>Barrier type: dam</li>
            {year > 0 ? <li>Constructed completed: {year}</li> : null}
            {height > 0 ? <li>Height: {height} feet</li> : null}
            {construction ? <li>Construction material: {CONSTRUCTION[construction].toLowerCase()}</li> : null}
            {purpose ? <li>Purpose: {PURPOSE[purpose].toLowerCase()}</li> : null}
            {condition ? <li>Structural condition: {DAM_CONDITION[condition].toLowerCase()}</li> : null}
        </ul>

        <h6 className="title is-6">Functional network information</h6>

        <ul>
            {hasnetwork ? (
                <React.Fragment>
                    <li>
                        <b>{formatNumber(gainmiles)}</b> miles could be gained by removing this barrier
                        <ul>
                            <li>{formatNumber(upstreammiles)} miles in the upstream network</li>
                            <li>{formatNumber(downstreammiles)} miles in the downstream network</li>
                        </ul>
                    </li>
                    <li>
                        <b>{sizeclasses}</b> river size {sizeclasses === 1 ? "class" : "classes"} could be gained by
                        removing this barrier
                    </li>
                    <li>
                        <b>{formatNumber(landcover, 0)}%</b> of the upstream floodplain is composed of natural landcover
                    </li>
                    <li>
                        The upstream network has <b>{SINUOSITY[sinuosity]}</b> sinuosity
                    </li>
                </React.Fragment>
            ) : (
                <li className="has-text-grey">
                    This barrier is off-network and has no functional network information.
                </li>
            )}
        </ul>

        <h6 className="title is-6">Species information</h6>
        <ul>
            {rarespp > 0 ? (
                <React.Fragment>
                    <li>
                        <b>{rarespp}</b> threatened and endangered aquatic species have been found in the subwatershed
                        containing this barrier.
                    </li>
                    <li className="has-text-grey is-size-7">
                        Note: species information is very incomplete. These species may or may not be directly impacted
                        by this barrier.
                    </li>
                </React.Fragment>
            ) : (
                <li className="has-text-grey">
                    No threatened and endangered aquatic species occurrence information is available for this
                    subwatershed.
                </li>
            )}
        </ul>

        <h6 className="title is-6">Feasibility of removal</h6>
        <ul>
            {recon ? (
                <li>{RECON[recon]}</li>
            ) : (
                <li className="has-text-grey">No feasibility information is available for this barrier.</li>
            )}
        </ul>
    </div>
)

// TODO: feasibility, metrics

DamDetails.propTypes = {
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
    hasnetwork: PropTypes.bool.isRequired,
    river: PropTypes.string,
    basin: PropTypes.string.isRequired,
    height: PropTypes.number,
    year: PropTypes.number,
    construction: PropTypes.number,
    purpose: PropTypes.number,
    condition: PropTypes.number,
    rarespp: PropTypes.number,
    recon: PropTypes.number,
    gainmiles: PropTypes.number,
    upstreammiles: PropTypes.number,
    downstreammiles: PropTypes.number,
    sinuosity: PropTypes.number,
    landcover: PropTypes.number,
    sizeclasses: PropTypes.number
}

DamDetails.defaultProps = {
    river: "",
    height: 0,
    year: 0,
    construction: 0,
    purpose: 0,
    condition: 0,
    rarespp: 0,
    recon: 0,
    gainmiles: null,
    upstreammiles: null,
    downstreammiles: null,
    sinuosity: null,
    landcover: null,
    sizeclasses: null
}

export default DamDetails
