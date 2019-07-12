export enum TypeTag {
    NUMBER
}

export interface ICustomType {
    type: TypeTag;
    rules: any;
}


export const createNumberType = (rules?: any): ICustomType => ({
    type: TypeTag.NUMBER,
    rules
});


export interface CustomTypeSetting {
    title: string;
    prop: string;
    type: ICustomType;
}

export interface CustomTypeSettings {
    props: CustomTypeSetting[];
}



/*****************
 * Built-in types
 *****************/

export const ColumnCustomSettings: CustomTypeSettings = {
    props: [
        {
            title: "Span",
            prop: "span",
            type: createNumberType({
                min: 1,
                max: 12,
                step: 1
            })
        }
    ]
};