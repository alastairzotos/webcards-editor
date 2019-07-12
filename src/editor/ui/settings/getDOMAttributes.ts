import ReactAttributeMappings from './reactAttributeMappings';

const toCamelCase = (input: string):string => {
    if (input.includes('-')) {
        let [first, ...parts] = input.split('-');

        return first + parts.map(part => part[0].toUpperCase() + part.substring(1));
    }

    return input;
};

const getDOMAttributes = (element: HTMLElement) => {
    let attr = {} as any;

    for (var att, i = 0, atts = element.attributes, n = atts.length; i < n; i++){
        att = atts[i];
        attr[att.nodeName] = att.nodeValue;
    }

    Object.keys(attr).forEach(cattr => {
        if (ReactAttributeMappings[cattr]) {
            let cur = attr[cattr];
            delete attr[cattr];
            attr[ReactAttributeMappings[cattr]] = cur;
        }
    });

    let styles = window.getComputedStyle(element); //element.style;

    let newStyles = {};
    Object.keys(styles).forEach(styleKey => {
        if (isNaN(parseInt(styleKey))) {
            newStyles[toCamelCase(styleKey)] = styles[styleKey];
        }
    });

    attr.style = newStyles;

    return attr;
}

export default getDOMAttributes;