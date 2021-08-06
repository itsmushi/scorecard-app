import {Fn} from "@iapps/function-analytics";
import {Period} from "@iapps/period-utilities";
import {uniq, zipObjectDeep} from 'lodash'


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
            .get().then(({_data: analytics}) => {
                if (analytics) {
                    const rows = analytics?.rows;
                    return rows?.map((row) =>
                        zipObjectDeep(analytics?.headers
                            ?.map(({name}) => name), row))
                }
            })

    } catch (e) {
        console.log(e)
    }
}
