import {CenteredContent, CircularLoader, colors} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from "react";

export default function FullPageLoader({text}) {

    return (
        <div className='column center' style={{height: '100%'}}>
            <CenteredContent>
                <div>
                    <CircularLoader/>
                    <p style={{color: colors.default}}>{text}</p>
                </div>
            </CenteredContent>
        </div>
    )
}

FullPageLoader.propTypes = {
    text: PropTypes.string
};

