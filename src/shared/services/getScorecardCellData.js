import {Fn} from "@iapps/function-analytics";
import {Period} from "@iapps/period-utilities";
import {uniq} from 'lodash'


export default async function getScorecardCellData({orgUnit, periods, dataSources}) {
    try {
        const previousPeriods = periods?.map((id) => {
            const period = new Period().getById(id)
            return period?.lastPeriod?.id
        })
        const allPeriods = uniq([...periods, ...previousPeriods])
        return await new Fn.Analytics()
            .setOrgUnit(orgUnit)
            .setPeriod(allPeriods?.join(";"))
            .setData(dataSources.join(";"))
            .get();
    } catch (e) {
        console.log(e)
    }
}
