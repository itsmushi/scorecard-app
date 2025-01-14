export default class FormFieldModel {
    constructor({
                    id,
                    name,
                    formName,
                    valueType,
                    mandatory,
                    compulsory,
                    validations,
                    optionSet,
                    min,
                    max,
                    dependants,
                    disabled,
        multipleField,
        multipleFields,
        legendDefinition
                }) {
        this.id = id;
        this.disabled = disabled;
        this.name = name;
        this.formName = formName;
        this.valueType = valueType;
        this.validations = validations;
        this.mandatory = mandatory || compulsory;
        this.optionSet = optionSet;
        this.min = min; //min value for number and date fields
        this.max = max; //max value for number and date fields
        this.dependants = dependants; //Array of field Ids this form field depends on for validation
        this.multipleField = multipleField;
        this.legendDefinition = legendDefinition;
        this.multipleFields = multipleFields
    }


}
