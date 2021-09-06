import i18n from '@dhis2/d2-i18n'
import {DataTableCell, DataTableColumnHeader, DataTableRow, InputField} from "@dhis2/ui";
import {debounce} from 'lodash'
import PropTypes from 'prop-types'
import React, {useEffect, useRef, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {ScorecardTableConstants} from "../../../../../../../../../core/constants/table";
import {PeriodResolverState} from "../../../../../../../../../core/state/period";
import {ScorecardTableConfigState, ScorecardViewState} from "../../../../../../../../../core/state/scorecard";

export default function GroupsHeaderRow({nested, orgUnits}) {
    const {dataGroups} = useRecoilValue(ScorecardViewState('dataSelection')) ?? {}
    const {averageColumn} = useRecoilValue(ScorecardViewState('options')) ?? {}
    const periods = useRecoilValue(PeriodResolverState) ?? []
    const [orgUnitKeyword, setOrgUnitKeyword] = useRecoilState(ScorecardViewState('orgUnitSearchKeyword'))
    const [sort, setSort] = useRecoilState(ScorecardViewState('tableSort'))
    const [searchValue, setSearchValue] = useState(orgUnitKeyword);
    const {nameColumnWidth} = useRecoilValue(ScorecardTableConfigState(orgUnits))
    const onOrgUnitSearch = useRef(debounce(setOrgUnitKeyword, 1000, {trailing: true, leading: false}))
    useEffect(() => {
        onOrgUnitSearch.current(searchValue)
    }, [searchValue])


    const onSortIconClick = ({direction}) => {
        setSort(prevValue => ({...prevValue, orgUnit: direction}))
    }

    return (
        <DataTableRow>
            <DataTableCell rowSpan={"3"} className={'jsx-1369417008'} fixed left={"0"} width={"50px"}/>
            <DataTableColumnHeader
                large
                name={'orgUnit'}
                onSortIconClick={onSortIconClick}
                sortDirection={sort?.orgUnit} align='left' fixed top={"0"} left={"50px"}
                bordered
                width={nameColumnWidth}
                className='scorecard-table-header scorecard-org-unit-cell ' rowSpan={"3"}>
                {
                    !nested &&
                    <InputField className='print-hide w-100' value={searchValue} onChange={({value}) => setSearchValue(value)}
                                placeholder={i18n.t('Search Organisation Unit')}/>
                }
                <h4 className='print-show hide'>{i18n.t('Organisation Unit(s)')}</h4>
            </DataTableColumnHeader>
            {
                dataGroups?.map(({title, id, dataHolders}) => (
                    <DataTableCell fixed className='scorecard-table-header' align='center' bordered
                                   width={`${((dataHolders?.length ?? 1) * (periods?.length ?? 1)) * ScorecardTableConstants.CELL_WIDTH}px`}
                                   colSpan={`${(dataHolders?.length ?? 1) * (periods?.length ?? 1)}`} key={id}>
                        {title}
                    </DataTableCell>
                ))
            }
            {
                averageColumn &&
                <DataTableCell width={`${ScorecardTableConstants.CELL_WIDTH}px`} fixed align='center' bordered
                               className='scorecard-table-header' rowSpan={"3"}>
                    {i18n.t('Average')}
                </DataTableCell>
            }

        </DataTableRow>
    )
}

GroupsHeaderRow.propTypes = {
    nested: PropTypes.bool.isRequired,
    orgUnits: PropTypes.array.isRequired
};

