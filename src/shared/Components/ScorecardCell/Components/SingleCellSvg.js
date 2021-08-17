import PropTypes from 'prop-types'
import React from 'react'
import {DecreasingArrows, IncreasingArrows} from "./Arrows";

export default function SingleCellSvg({color, value, status}) {
    const width = 100;
    const height = 47;
    const fontSize = 12;

    return (
        <svg width={width} height={height} style={{display: 'block'}}>
            <polygon points={`0 0 0 ${height} ${width} ${height} ${width} 0`} style={{fill: color ?? '#FFFFFF'}}/>
            {status && (status === 'increasing' ?
                <IncreasingArrows fontSize={fontSize} y={height - (fontSize * 2)} x={(width / 2 - (fontSize * 2))}/> :
                <DecreasingArrows fontSize={fontSize} y={height - fontSize} x={(width / 2 - (fontSize * 2))}/>)}
            <text lengthAdjust="spacingAndGlyphs" fontSize={fontSize} x={width / 2 - fontSize}
                  y={height - fontSize}>{value}</text>
        </svg>
    )
}

SingleCellSvg.propTypes = {
    value: PropTypes.string.isRequired,
    color: PropTypes.string,
    status: PropTypes.oneOf(['increasing', 'decreasing'])
};
