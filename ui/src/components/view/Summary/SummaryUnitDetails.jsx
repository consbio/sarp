import React from "react"
import PropTypes from "prop-types"

import { FeaturePropType } from "../../../CustomPropTypes"
import { formatNumber, formatPercent } from "../../../utils/format"

import { LAYER_CONFIG } from "../../map/config"
import { stateFIPS } from "../../../constants"

import summaryStats from "../../../data/summary_stats.json"

const SummaryUnitDetails = ({ selectedFeature, type, total, meanConnectedMiles, onClose }) => {
    const { id, layerId, name, dams, barriers, miles } = selectedFeature.toJS()
    const layerConfig = LAYER_CONFIG.filter(({ id: lyrID }) => lyrID === layerId)[0]
    let { title: layerTitle } = layerConfig

    const count = type === "dams" ? dams : barriers

    const percent = (100 * count) / total
    const milesCompare = miles - meanConnectedMiles

    let title = name || id
    if (layerId === "County") {
        title = `${name} County`
        layerTitle = stateFIPS[id.slice(0, 2)]
    }

    return (
        <React.Fragment>
            <div id="SidebarHeader" className="flex-container flex-justify-center flex-align-start">
                <div className="flex-grow">
                    <h3 className="title is-5 no-margin">{title}</h3>
                    {layerId !== "State" && <h5 className="is-size-6 is-text-gray">{layerTitle}</h5>}
                </div>
                <div className="icon button" onClick={onClose}>
                    <span className="fa fa-times-circle is-size-4" />
                </div>
            </div>
            <div id="SidebarContent" className="flex-container-column">
                {type === "dams" ? (
                    <React.Fragment>
                        {count > 0 ? (
                            <React.Fragment>
                                <p className="is-size-5">
                                    This area contains at least {formatNumber(count, 0)} dams that have been inventoried
                                    so far, resulting in an average of {formatNumber(Math.max(miles, 0))} miles of
                                    connected rivers and streams.
                                    <br />
                                    <br />
                                    This area has {formatPercent(percent)}% of the inventoried dams in the Southeast and{" "}
                                    {formatNumber(Math.abs(milesCompare))} {milesCompare > 0 ? "more" : "less"} miles of
                                    connected river network than the average for the region.
                                </p>
                                <p className="is-size-7 has-text-grey">
                                    <br />
                                    <br />
                                    Note: These statistics are based on <i>inventoried</i> dams. Because the inventory
                                    is incomplete in many areas, areas with a high number of dams may simply represent
                                    areas that have a more complete inventory.
                                </p>
                            </React.Fragment>
                        ) : (
                            <p className="is-size-5">This area does not yet have any inventoried dams</p>
                        )}
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        {count > 0 ? (
                            <React.Fragment>
                                <p className="is-size-5">
                                    This area contains at least {formatNumber(count, 0)} road-related barriers that have
                                    been inventoried so far.
                                </p>
                                <p className="is-size-7 has-text-grey">
                                    <br />
                                    <br />
                                    Note: These statistics are based on <i>inventoried</i> road-related barriers that
                                    have been assessed for impacts to aquatic organisms. Because the inventory is
                                    incomplete in many areas, areas with a high number of barriers may simply represent
                                    areas that have a more complete inventory.
                                </p>
                            </React.Fragment>
                        ) : (
                            <p className="is-size-5">
                                This area does not yet have any road-related barriers that have been assessed for
                                impacts to aquatic organisms.
                            </p>
                        )}
                    </React.Fragment>
                )}
            </div>
        </React.Fragment>
    )
}

SummaryUnitDetails.propTypes = {
    type: PropTypes.string.isRequired,
    selectedFeature: FeaturePropType.isRequired,
    onClose: PropTypes.func.isRequired,
    total: PropTypes.number.isRequired,
    meanConnectedMiles: PropTypes.number.isRequired,
    summaryStats: PropTypes.object
}

SummaryUnitDetails.defaultProps = {
    summaryStats
}

export default SummaryUnitDetails