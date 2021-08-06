import {useDataQuery} from "@dhis2/app-runtime";
import {debounce, isEmpty} from 'lodash'
import {useEffect, useRef, useState} from "react";
import {useRecoilValueLoadable} from "recoil";
import {OrgUnitChildren} from "../../core/state/orgUnit";


export function useOrganisationUnitChildren(orgUnitId = '') {
    const [id, setId] = useState(orgUnitId);
    const {state, contents} = useRecoilValueLoadable(OrgUnitChildren(id))
    return {
        loading: state === 'loading',
        orgUnits: state === 'hasValue' ? contents : [],
        error: state === 'hasError' ? contents : undefined,
        setId
    }
}

const orgUnitSearchQuery = {
    nameQuery: {
        resource: 'organisationUnits',
        params: ({keyword}) => ({
            filter: [
                `displayName:ilike:${keyword}`
            ],
            fields: [
                'id',
                'displayName',
                'path'
            ]
        })
    },
    idQuery: {
        resource: 'organisationUnits',
        params: ({keyword}) => ({
            filter: [
                `id:ilike:${keyword}`
            ],
            fields: [
                'id',
                'displayName',
                'path'
            ]
        })
    },
}

export function useSearchOrganisationUnit() {
    const [keyword, setKeyword] = useState();
    const {data, error, loading, refetch} = useDataQuery(orgUnitSearchQuery, {lazy: true})
    const updateKeyword = useRef(debounce(setKeyword, 3000, {trailing: true, leading: false}))

    useEffect(() => {
        if (!isEmpty(keyword)) {
            refetch({keyword})
        }
    }, [keyword]);

    return {
        orgUnits: !isEmpty(data) ? [...(data?.idQuery?.organisationUnits ?? []), ...(data?.nameQuery?.organisationUnits ?? [])] : [],
        error,
        loading,
        updateKeyword: updateKeyword.current
    }
}
