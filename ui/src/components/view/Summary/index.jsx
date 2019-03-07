import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"

import * as actions from "../../../actions/summary"
import { FeaturePropType } from "../../../CustomPropTypes"
import { formatNumber } from "../../../utils/format"

import SummaryMap from "./Map"
import Sidebar from "../../Sidebar"
import UnitSearch from "../../UnitSearch"
import SummaryUnitDetails from "./SummaryUnitDetails"
import { LAYER_ZOOM } from "../../map/config"

import summaryStats from "../../../data/summary_stats.json"

const Summary = ({ selectedFeature, system, type, selectFeature, setCenter }) => {
    const { dams, barriers, miles } = summaryStats.southeast
    const total = type === "dams" ? dams : barriers

    const handleSearchSelect = (id, bbox, layer) => {
        // selectFeature(id)

        setCenter({
            latitude: (bbox[3] - bbox[1]) / 2 + bbox[1],
            longitude: (bbox[2] - bbox[0]) / 2 + bbox[0],
            zoom: LAYER_ZOOM[layer]
        })
    }

    return (
        <React.Fragment>
            <Sidebar>
                {selectedFeature === null ? (
                    <div id="SidebarContent">
                        <p>
                            Across the Southeast, there are at least {formatNumber(dams)} dams, resulting in an average
                            of {formatNumber(miles)} miles of connected rivers and streams.
                            <br />
                            <br />
                            Click on a summary unit the map for more information about that area.
                            <br />
                            <br />
                        </p>

                        <div>
                            <UnitSearch system={system} onSelect={handleSearchSelect} />
                        </div>

                        <p className="has-text-grey">
                            <br />
                            <br />
                            Note: These statistics are based on <i>inventoried</i> dams. Because the inventory is
                            incomplete in many areas, areas with a high number of dams may simply represent areas that
                            have a more complete inventory.
                        </p>
                    </div>
                ) : (
                    <SummaryUnitDetails
                        selectedFeature={selectedFeature}
                        total={total}
                        type={type}
                        meanConnectedMiles={miles}
                        onClose={() => selectFeature(null)}
                    />
                )}
            </Sidebar>
            <div id="MapContainer">
                <SummaryMap />
            </div>
        </React.Fragment>
    )
}

Summary.propTypes = {
    selectedFeature: FeaturePropType,
    type: PropTypes.string.isRequired,
    system: PropTypes.string.isRequired,
    selectFeature: PropTypes.func.isRequired,
    setCenter: PropTypes.func.isRequired
}

Summary.defaultProps = {
    selectedFeature: null
}

const mapStateToProps = globalState => {
    const state = globalState.get("summary")

    return {
        system: state.get("system"),
        type: state.get("type"),
        selectedFeature: state.get("selectedFeature")
    }
}

export default connect(
    mapStateToProps,
    actions
)(Summary)
