import {useAlert} from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import {Button, ButtonStrip} from "@dhis2/ui";
import {Step, StepLabel, Stepper} from "@material-ui/core";
import {findIndex, fromPairs, isEmpty} from "lodash";
import React, {Suspense, useEffect, useMemo, useRef, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {useRecoilCallback, useRecoilValue, useSetRecoilState, waitForAll} from "recoil";
import Scorecard from "../../../../core/models/scorecard";
import ScorecardConfState, {
    ScorecardConfigDirtyState,
    ScorecardConfigEditState,
    ScorecardConfigErrorState,
    ScorecardIdState,
} from "../../../../core/state/scorecard";
import {UserAuthorityOnScorecard, UserState} from "../../../../core/state/user";
import {FullPageLoader} from "../../../../shared/Components/Loaders";
import {useAddScorecard, useUpdateScorecard,} from "../../../../shared/hooks/datastore/useScorecard";
import useMediaQuery from "../../../../shared/hooks/useMediaQuery";
import AccessDeniedPage from "../ScorecardView/Components/AccessDeniedPage";
import AccessScorecardForm from "./Components/Access";
import DataConfigurationScorecardForm from "./Components/DataConfiguration";
import GeneralScorecardForm from "./Components/General";
import HighlightedIndicatorsScorecardForm from "./Components/HighlightedIndicators";
import OptionsScorecardForm from "./Components/Options";
import validateScorecard from "./services/validator";

const steps = [
    {
        label: i18n.t("General"),
        component: GeneralScorecardForm,
    },
    {
        label: i18n.t("Data Configuration"),
        component: DataConfigurationScorecardForm,
    },
    {
        label: i18n.t("Highlighted Indicators"),
        component: HighlightedIndicatorsScorecardForm,
    },
    {
        label: i18n.t("Access"),
        component: AccessScorecardForm,
    },
    {
        label: i18n.t("Options"),
        component: OptionsScorecardForm,
    },
];

const keys = Object.keys(new Scorecard())

export default function ScoreCardManagement() {
    const {id: scorecardId} = useParams();
    const user = useRecoilValue(UserState);
    const {write: writeAccess} = useRecoilValue(UserAuthorityOnScorecard(scorecardId))
    const setScorecardIdState = useSetRecoilState(ScorecardIdState);
    const {update} = useUpdateScorecard(scorecardId);
    const {add} = useAddScorecard();
    const {show} = useAlert(
        ({message}) => message,
        ({type}) => ({...type, duration: 3000})
    );
    const [saving, setSaving] = useState(false);
    const {width, height} = useMediaQuery();
    const history = useHistory();
    const [activeStep, setActiveStep] = useState(steps[0]);
    const Component = activeStep.component;

    const resetStates = useRecoilCallback(({reset}) => () => {
        reset(ScorecardIdState)
        reset(ScorecardConfState(scorecardId))
        reset(ScorecardConfigEditState)
        reset(ScorecardConfigErrorState)
        for (const key of keys) {
            reset(ScorecardConfigDirtyState(key))
        }
    })

    const createNewScorecard = async (updatedScorecard) => {
        await Scorecard.save(updatedScorecard, add, user);
        show({
            message: 'Scorecard added successfully',
            type: {success: true}
        })
        history.goBack();
    }

    const updateData = async (updatedScorecard) => {
        await Scorecard.update(updatedScorecard, update);
        show({
            message: 'Scorecard updated successfully',
            type: {success: true}
        })
        history.goBack();
    }

    const onSave = useRecoilCallback(({snapshot, set}) => async () => {
        setSaving(true)
        try {
            const updatedScorecard = (snapshot.getLoadable(
                    waitForAll(
                        fromPairs(keys?.map(key => ([key, ScorecardConfigDirtyState(key)])))
                    )
                )
            ).contents;

            const errors = validateScorecard(updatedScorecard);

            if (!isEmpty(errors)) {
                set(ScorecardConfigErrorState, errors)
                const errorMessage = `Please fill in the required field(s)`
                show({
                    message: i18n.t(errorMessage),
                    type: {info: true}
                })
            }

            if (isEmpty(errors)) {

                if (scorecardId) {
                    await updateData(updatedScorecard);
                } else {
                    await createNewScorecard(updatedScorecard)
                }
            }
        } catch (e) {
            console.log(e)
        }
        setSaving(false)
    })

    const onNextStep = () => {
        if (!hasNextStep) {
            onSave();
            return;
        }
        const index = findIndex(steps, ["label", activeStep.label]);
        if (index !== steps.length - 1) {
            setActiveStep(steps[index + 1]);
        }
    };

    const onPreviousStep = () => {
        const index = findIndex(steps, ["label", activeStep.label]);
        if (index !== 0) {
            setActiveStep(steps[index - 1]);
        }
    };

    const onCancel = () => {
        history.goBack();
    };

    useEffect(() => {
        setScorecardIdState(scorecardId);
        return () => {
            resetStates();
        };
    }, [scorecardId]);


    const hasNextStep = useMemo(
        () => findIndex(steps, ["label", activeStep.label]) !== steps.length - 1,
        [activeStep]
    );
    const hasPreviousStep = useMemo(
        () => findIndex(steps, ["label", activeStep.label]) > 0,
        [activeStep]
    );

    if(!writeAccess && scorecardId){
        return <AccessDeniedPage accessType={"edit"} />
    }

    return (
        <Suspense fallback={<FullPageLoader/>}>
            <div className="container">
                <div className="column">
                    <div>
                        <Stepper>
                            {steps?.map((step) => (
                                <Step
                                    style={
                                        step === activeStep ? {background: "#00695c"} : undefined
                                    }
                                    active={step === activeStep}
                                    onClick={() => setActiveStep(step)}
                                    key={`${step.label}-step`}
                                >
                                    <StepLabel>{step.label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </div>
                    <div className="row">
                        <div className="column center" style={{flex: 1}}>
                            <div
                                className="container container-bordered background-white center"
                                style={{width: width * 0.96, minHeight: height * 0.78}}
                            >
                                <div className="row" style={{height: "100%"}}>
                                    <div
                                        className="column p-16"
                                        style={{height: "100%", justifyContent: "space-between"}}
                                    >
                                        {<Component />}
                                        <ButtonStrip end>
                                            <Button
                                                disabled={!hasPreviousStep}
                                                onClick={onPreviousStep}
                                            >
                                                {i18n.t("Previous")}
                                            </Button>
                                            <Button
                                                primary
                                                disabled={saving}
                                                onClick={onNextStep}
                                                dataTest="scorecard-admin-next-button"
                                            >
                                                {!hasNextStep
                                                    ? saving
                                                        ? `${i18n.t("Saving")}...`
                                                        : i18n.t("Save")
                                                    : i18n.t("Next")}
                                            </Button>
                                        </ButtonStrip>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row center p-32">
                        <ButtonStrip center>
                            <Button onClick={onCancel}>{i18n.t("Cancel")}</Button>
                            <Button disabled={saving} onClick={onSave} primary>
                                {saving ? `${i18n.t("Saving")}...` : i18n.t("Save")}
                            </Button>
                        </ButtonStrip>
                    </div>
                </div>
            </div>
        </Suspense>
    );
}
