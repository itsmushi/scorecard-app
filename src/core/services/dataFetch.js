import async from 'async'
import getScorecardCellData from "../../shared/services/getScorecardCellData";

export default class ScorecardDataFetch {
    constructor() {
        this.worker = getScorecardCellData
        this.queue = async.queue(this.worker, 2)
    }
    async getData(props) {
        return this.queue.pushAsync(props);
    }

    kill(){
        return this.queue.kill();
    }

}
