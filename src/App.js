import {DataStoreProvider} from "@dhis2/app-service-datastore";
import React, {Suspense} from 'react'
import {ErrorBoundary} from "react-error-boundary";
import {RecoilRoot,} from "recoil";
import './App.css'
import Router from "./modules/Router";
import FullPageError from "./shared/Components/Errors/FullPageError";
import {FullPageLoader} from "./shared/Components/Loaders";
import './locales'


const MyApp = () => (
    <DataStoreProvider namespace={'hisptz-scorecard'} loadingComponent={<FullPageLoader/>}>
        <RecoilRoot>
            <ErrorBoundary FallbackComponent={FullPageError}>
                <Suspense fallback={<FullPageLoader/>}>
                    <div className='main-container'>
                        <Router/>
                    </div>
                </Suspense>
            </ErrorBoundary>
        </RecoilRoot>
    </DataStoreProvider>
)

export default MyApp
