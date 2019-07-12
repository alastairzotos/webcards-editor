import * as cnt from '../content/content';


export default class Generator<T = any> {
    generate = (content: cnt.ContentItem | cnt.ContainerItem, key: string = undefined, index: number = 0): T => {
        if (cnt.isContainer(content)) {
            return this.generateContainer(content as cnt.ContainerItem, (content as cnt.ContainerItem).children.map((child, index) => this.generate(child, child.id, index)), key, index);
        } else {
            return this.generateContent(content, key, index);
        }
    }

    generateContent = (content: cnt.ContentItem, key: string = undefined, index: number = 0): T => { return null; }
    generateContainer = (container: cnt.ContainerItem, children: any, key: string = undefined, index: number = 0): T => { return null; };
}