import * as React from 'react';
import * as cnt from '../content/content';
import Generator from './generator';

import ComponentWrapper from './componentWrapper';

export default class EditorHtmlGenerator extends Generator<any> {

    private _commonProps = (content: cnt.ContentItem, key: string, index: number) => ({
        content: content,
        key: key,
        style: content.data.style,
        position: index
    });

    generateContent = (content: cnt.ContentItem, key: string = undefined, index: number = 0): any => {
        return (
            <ComponentWrapper
                {...content.type.generateProps(content)}
                {...this._commonProps(content, key, index)}
            />
        );
    };

    generateContainer = (container: cnt.ContainerItem, children: any[], key: string = undefined, index: number = 0): any => {
        return (
            <ComponentWrapper
                {...container.type.generateProps(container)}
                {...this._commonProps(container, key, index)}
            >{children}</ComponentWrapper>
        );
    };
}
