import {uid} from "../../shared/utils/utils";
import {SavableDataModel} from "./base";
import DataSelection from "./dataSelection";
import OrgUnitSelection from "./orgUnitSelection";
import PeriodSelection from "./periodSelection";
import ScorecardAccess from "./scorecardAccess";
import ScorecardOption from "./scorecardOptions";

export default class Scorecard extends SavableDataModel {

    get defaults() {
        return {
            id: uid(),
            name: '',
            title: 'Untitled',
            subtitle: '',
            description: '',
            customHeader: '',
            legendDefinitions: [],
            dataSelection: new DataSelection(),
            orgUnitSelection: new OrgUnitSelection(),
            periodSelection: new PeriodSelection(),
            options: new ScorecardOption(),
            highlightedIndicators: [],
            publicAccess: new ScorecardAccess(),
            userGroupAccesses: [],
            userAccesses: [],
            user: {}
        }
    }

}

