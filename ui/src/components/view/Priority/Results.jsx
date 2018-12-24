import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import ImmutablePropTypes from "react-immutable-proptypes"
import debounce from 'lodash.debounce'


import * as actions from "../../../actions/priority"
import { API_HOST } from "../../../config"
import { apiQueryParams } from "../../../utils/api"
import { formatNumber } from "../../../utils/format"

import Histogram from "./Histogram"

import StartOverButton from "./StartOverButton"
import { SCENARIOS } from "../../map/config"

const Results = ({ type, scenario, totalCount, layer, summaryUnits, filters, rankData, setMode, tierThreshold, setTierThreshold }) => {
    const scenarioLabel =
        scenario === "ncwc"
            ? "combined network connectivity and watershed condition"
            : SCENARIOS[scenario].toLowerCase()

    const tierCounts = {}
    rankData.toJS().forEach(d => {
        const tier = d[`${scenario}_tier`]
        if (!tierCounts[tier]) {
            tierCounts[tier] = 0
        }
        tierCounts[tier] += 1
    })

    const tiers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    const counts = tiers.map(i => tierCounts[i] || 0)

    const handleThresholdChange = ({target: {value}}) => {
        debounce(() => setTierThreshold(21 - value), 50)()
    }

    return (
        <React.Fragment>
            <div id="SidebarHeader">
                <button className="link link-back" type="button" onClick={() => setMode("filter")}>
                    <span className="fa fa-reply" />
                    &nbsp; modify filters
                </button>
                <h4 className="title is-4 no-margin">Explore results</h4>
                <div className="has-text-grey flex-container flex-justify-space-between">
                    <div>
                        {formatNumber(totalCount, 0)} prioritized {type}
                    </div>
                </div>
            </div>
            <div id="SidebarContent">
                <p className="text-help">
                    {type.slice(0, 1).toUpperCase() + type.slice(1)} are binned into tiers based on where they fall
                    within the value range of the <b>{scenarioLabel}</b> score. Tier 1 includes {type} that fall within
                    the top 5% of values for this score, and tier 20 includes {type} that fall within the lowest 5% of
                    values for this score.
                    <br />
                    <br />
                </p>

                <div style={{ margin: "2rem 0" }}>
                    <h6 className="title is-6 no-margin">Choose top-ranked dams for display on map</h6>

                    <div className="flex-container">
                        <div className="is-size-7">Lowest tier</div>
                        <input type="range" min="1" max="20" step="1" className="flex-grow" value={21 - tierThreshold} onChange={handleThresholdChange}/>
                        <div className="is-size-7">Highest tier</div>
                    </div>
                </div>

                <h6 className="title is-6 no-margin">Number of dams by tier</h6>

                <Histogram counts={counts} threshold={tierThreshold} />
            </div>

            <div id="SidebarFooter">
                <div className="flex-container flex-justify-center flex-align-center">
                    <StartOverButton />

                    <a
                        href={`${API_HOST}/api/v1/${type}/csv/${layer}?${apiQueryParams(
                            summaryUnits.toJS(),
                            filters.toJS()
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button is-info is-medium"
                    >
                        <i className="fa fa-download" style={{ marginRight: "0.25em" }} />
                        Download {type}
                    </a>
                </div>
            </div>
        </React.Fragment>
    )
}

Results.propTypes = {
    type: PropTypes.string.isRequired,
    scenario: PropTypes.string.isRequired,
    totalCount: PropTypes.number.isRequired,
    layer: PropTypes.string.isRequired,
    filters: ImmutablePropTypes.mapOf(
        ImmutablePropTypes.setOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
    ).isRequired,

    summaryUnits: ImmutablePropTypes.set.isRequired,
    rankData: ImmutablePropTypes.listOf(ImmutablePropTypes.map).isRequired,

    tierThreshold: PropTypes.number.isRequired,

    setMode: PropTypes.func.isRequired,
    setTierThreshold: PropTypes.func.isRequired

}

const mapStateToProps = globalState => {
    const state = globalState.get("priority")

    return {
        type: state.get("type"),
        scenario: state.get("scenario"),
        totalCount: state.get("totalCount"),
        layer: state.get("layer"),
        summaryUnits: state.get("summaryUnits"),
        filters: state.get("filters"),
        rankData: state.get("rankData"),
        tierThreshold: state.get("tierThreshold")
    }
}

export default connect(
    mapStateToProps,
    actions
)(Results)
