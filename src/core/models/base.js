import {cloneDeep, defaultsDeep} from 'lodash'


export default class DataModel {
    constructor(attributes = {}) {
        defaultsDeep(this, attributes, this.defaults)
    }

    get defaults() {
        return {}
    }

    static set(object, key, value) {
        if (key) {
            const updatedObject = cloneDeep(object);
            updatedObject[key] = value;
            return updatedObject;
        }
        return this;
    }

    static setObject(object, values = {}) {
        const updatedObject = cloneDeep(object);
        for (const key of Object.keys(values)) {
            updatedObject[key] = values[key];
        }
        return updatedObject;
    }


}


export class SavableDataModel extends DataModel {

    static async save(object, functions) {
        return await functions.add(JSON.parse(JSON.stringify(object)))
    }

    static async update(id, object, functions) {
        return await functions.replace(id, JSON.parse(JSON.stringify(object)))
    }
}

