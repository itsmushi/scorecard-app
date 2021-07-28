import {useAlert} from "@dhis2/app-runtime";
import {DataTable, DataTableBody} from '@dhis2/ui'
import {head, isEmpty} from 'lodash'
import PropTypes from 'prop-types'
import React, {Fragment, useEffect, useMemo, useState} from 'react'
import {useRecoilValue} from "recoil";
import ScorecardConfState, {ScorecardViewSelector} from "../../../../../../core/state/scorecard";
import {FullPageLoader} from "../../../../../../shared/Components/Loaders";
import useMediaQuery from "../../../../../../shared/hooks/useMediaQuery";
import {
    useOrganisationUnitChildren,
    useSearchOrganisationUnit
} from "../../../../../../shared/hooks/useOrganisationUnits";
import ChildOrgUnitRow from "./Components/ChildOrgUnitRow";
import EmptyDataGroups from "./Components/EmptyDataGroups";
import ParentOrgUnitRow from "./Components/ParentOrgUnitRow";
import TableHeader from "./Components/TableHeader";
import {getTableWidth} from "./services/utils";

export default function ScorecardTable({orgUnits, nested}) {
    const {width: screenWidth} = useMediaQuery()
    const {dataSelection} = useRecoilValue(ScorecardConfState)
    const {periods} = useRecoilValue(ScorecardViewSelector('periodSelection')) ?? []
    const searchKeyword = useRecoilValue(ScorecardViewSelector('orgUnitSearchKeyword'))
    const {dataGroups} = dataSelection
    const tableWidth = useMemo(() => getTableWidth(periods, dataGroups, screenWidth), [periods, dataGroups, dataSelection]);
    const {loading, error, orgUnits: childrenOrgUnits, setId} = useOrganisationUnitChildren()
    const {
        orgUnits: searchResults,
        setKeyword,
        error: searchError,
    } = useSearchOrganisationUnit()
    const {show} = useAlert(({message}) => message, ({type}) => ({...type, duration: 3000}))
    const [expandedOrgUnit, setExpandedOrgUnit] = useState();

    const filteredOrgUnits = useMemo(() => {
        if (searchResults && searchKeyword) {
            return searchResults ?? []
        }
        return orgUnits;
    }, [searchResults, orgUnits, searchKeyword]);

    useEffect(() => {
        if (!isEmpty(searchKeyword)) {
            setKeyword(searchKeyword)
        } else {
            setKeyword(undefined)
        }
    }, [searchKeyword]);

    useEffect(() => {
        if (filteredOrgUnits?.length === 1) {
            setId(head(filteredOrgUnits)?.id)
        } else {
            setId(undefined)
        }
    }, [filteredOrgUnits])

    useEffect(() => {
        if (error) {
            show({message: error?.message ?? error?.details, type: {info: true}})
        }
        if (searchError) {
            show({message: searchError?.message ?? searchError?.details, type: {info: true}})
        }
    }, [error, searchError])

    return (
        <div className='w-100 pb-32 flex-1'>
            {
                isEmpty(dataGroups) ? <EmptyDataGroups/> :
                    <DataTable width={`${tableWidth}px`} scrollWidth={`${screenWidth}px`} layout='fixed'>
                        <TableHeader nested={nested} />
                        <DataTableBody>
                            {
                                loading ? <FullPageLoader/> : <Fragment>
                                    {
                                        filteredOrgUnits?.map((orgUnit) => (
                                            <ParentOrgUnitRow key={`${orgUnit?.id}-row`} orgUnit={orgUnit}/>))
                                    }
                                    {
                                        childrenOrgUnits?.map((orgUnit) => (
                                            <ChildOrgUnitRow key={`${orgUnit?.id}-row`} onExpand={setExpandedOrgUnit}
                                                             orgUnit={orgUnit}
                                                             expandedOrgUnit={expandedOrgUnit}/>))
                                    }
                                </Fragment>
                            }
                        </DataTableBody>
                    </DataTable>
            }
        </div>
    )
}

ScorecardTable.propTypes = {
    nested: PropTypes.bool.isRequired,
    orgUnits: PropTypes.arrayOf(PropTypes.object).isRequired
};


