import {apiFetchOrganisationUnitRoots} from '@dhis2/analytics'
import {useDataEngine} from "@dhis2/app-runtime";
import {useState, useEffect} from 'react';

export default function useOrgUnitsRoot() {
    const engine = useDataEngine();
    const [roots, setRoots] = useState();
    const [loading, setLoading] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        async function getOrgUnits() {
            try {
                setLoading(true);
                setRoots(await apiFetchOrganisationUnitRoots(engine));
                setLoading(false);
            } catch (e) {
                setError(e);
            }
        }
        getOrgUnits();
    }, [])

    return {roots, loading, error}
}
