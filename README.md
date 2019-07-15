# Webcards Editor

Webcards Editor is a powerful WYSIWYG page builder built on React/Redux in Typescript. 

#### Installation
`npm install webcards-editor`

---

### Usage
```ts
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import PageEditor from 'webcards-editor';
import  *  as  content  from  'webcards-editor/dist/editor/content/content';

ReactDOM.render(

	<PageEditor
		content={[
			content.generateContainer([
				content.generateText("Hello world!", { variant: "h1" })
			])
		]}
		
		onSave={(items, onComplete) => {
			saveToServer(items, () => {
				alert("Save complete!");
				onComplete();
			})
		}}
	/>,
	
	document.getElementById("app")
);
```
---

### Demo
[https://manager.webcards.me/webcards-demo](https://manager.webcards.me/webcards-demo)

---

### This is a WIP
I am building this as part of a project and it's still under development. Please submit any issues or feature requests to GitHub.

---

### API

The API is currently still in development and there may be some breaking changes in the future.



**PageEditor**
`import  PageEditor  from  'webcards-editor';`

The `PageEditor` component is the main component you'll have to use if all you want is to implement a simple page editor. This is the component responsible for loading content from the server into the editor and saving content from the editor to the server. All the details are handled by this component.

| Property | Type | Required | Description |
|--|--|--|--|
| content | `ContentItem[]` | Optional | The initial content of the page. This can be loaded in from the server as it is just a simple JSON object. It can also be generated manually using the `content` namespace (see below). |
|bodyOffset|`number`|Optional|The root of the content will try to automatically scale itself to *100vh*, which can be an obstacle if you have extra toolbars above the editor. Settings this number to e.g. 100 will set the body to be *100vh - 100px*.|
|onSave|`(items: ContentItem[], onComplete: ()=>void)`|Optional|When the save button on the toolbar is clicked this function is invoked and you can save the `items` to the server. When saving is done simply call `onComplete()` to stop saving.|
---

#### Namespace `content`

`import  *  as  content  from  'webcards-editor/dist/editor/content/content';`

**interface `ContentItem`**

* The `ContentItem` interface defines what an item in the editor is. Since we're never dealing with HTML directly this is the main type we use to determine what the page looks like. These are what you'll be saving and loading from the server, and you can use *generators* to convert these items into HTML.

* It is not recommended you create these objects manually and instead to use the utility functions instead (see below). Creating them manually requires a lot of house-keeping, such as giving them unique IDs, maintaining parent references and their positions within a container.

* This table is meant simply as a reference for querying the items.

|Property|Type|Required|Description|
|--|--|--|--|
|id|`string`|Required|A unique ID for the item
|type|`ItemType`|Required|The type of element. See `ItemType`.
|parent|`ContainerItem`|Required|The item containing this item
|position|`number`|Required|The index of the item relative to its siblings.
|data|`ContentData`|Required|Any information associated with the item, including style attributes. Custom attributes are allowed here.
---

**interface `ContainerItem`**

* A `ContainerItem` extends `ContentItem` to add a `children` property. It's exactly like a `ContentItem` except for the fact that it can contain other items itself.

* As above, it is not recommended to create these objects manually. Use the utility functions instead.

|Property|Type|Required|Description|
|--|--|--|--|
|children|`ContentItem[]`|Required|An array of `ContentItem`s (or `ContainerItem`s) which act as the children of this container.

---
**interface `ContentData`**

|Property|Type|Required|Description|
|--|--|--|--|
|style|CSSProperties|Required|React CSS properties
|*|any|Optional|You can add any other properties to the data item which might make it more useful. For example, the `column` type has a `span` attribute. This is also where you'd put your `className`s.

---

**Content creation utilities**

**`createContentItem(type: string, data: ContentData)=>ContentItem`**

* Creates a blank item with a type and associated data. The item type is derived from the ID string passed in as the first argument. This is a bare-bones function and may not create any associated items (such as child elements in a template).

**`createContainerItem(type: string, data: ContentData, children: ContentItem[])=>ContainerItem`**

* Like `createContentItem`, this will do the same but return a `ContainerItem` with an array of children attached. This will automatically set the `parent` reference of each child as well as their positions.

**`generateDefault(type: string, data?: ContentData, children?: ContentItem[])=>ContentItem`**

* Generates a default instance of an `ItemType`, identified by `type`. Unlike `createContentItem` this will do extra things that the `ItemType` wants, such as applying styles or even adding child items.

**`generateText(text: string, options?)=>ContentItem`**

* Generates a text item with populated with `text`. `options` is a `ContentData` object so must include a `style` attribute (even if empty), and a `variant` (*h1 - h6*, *p*, *span*)


**`generateContainer(children: ContentItem[], options?: ContentData)=>ContainerItem`**

* Utility to create a generic container with children.

**`generateRow(children?: ContentItem[])=>ContainerItem`**

* A row is a special type of container which can only contain columns. This is akin to rows and columns in Bootstrap.

**`generateColumn(span: IOneToTwelve, children?: ContentItem[])=>ContainerItem`**

* Generates a column with a span between 1 and 12.

---

#### Namespace `itemTypes`

`import  *  as  itemTypes  from  'webcards-editor/dist/editor/content/itemTypes';`

**Note**: This namespace is not yet complete. Adding new items types and categories is not currently possible without editing the source code. This is meant as a reference for querying items and their types.

**interface `ItemType`**

|Property|Type|Required|Description|
|--|--|--|--|
|id|`string`|Required|A unique ID for the item type, e.g. "text". This is used when calling `content.createItemType()`.
|name|`string`|Required|A human-friendly name which will be displayed in the left item list drawer.
|desc|`string`|Required|A human-friendly description which will be displayed when hovering over the handle in the left item list drawer.
|validChildren|`string|string[]`|Optional|A list of valid children that the item can contain. Use `*` for all types.
|invalidChildren|`string[]`|Optional|For some items it's easier to specify what they *can't* contain. For example, `container` can't contain `column` as only `row` can contain items of type `column`.
edittable|`boolean`|Required|Whether the item can be edited or not.
customTypeSettings|`CustomTypeSettings`|Optional|Additional settings for the type. These will generate controls in the right settings drawer. (See **custom**).
generateDefault|`(children?:ContentItem[], options?:ContentData)=>ContentItem`|Optional|Generates a default instance of this type.
generateProps|`(item: ContentItem)=>any`|Optional|Generates HTML attributes for an item so it can be rendered by React. Useful for doing things such as, `<MyWrapper {...item.type.generateProps(item)}></MyWrapper>`. See **Generators**.

---

**interface `ItemTypeCategory`**

* This is a simple interface to help categorise items in the left item list drawer.

* **Note**: It is still not possible to create new item type categories.

|Property|Type|Required|Description|
|--|--|--|--|
|name|`string`|Required|The human-readable name for the category.
|types|`ItemType[]`|Required|A list of items in this category.

---

#### Namespace `custom`

`import  *  as  custom  from  'webcards-editor/dist/editor/content/custom';`

* **Note**: This namespace is not yet complete and is simply meant as a reference.

* Custom settings can be applied to item types which will render controls for them in the right settings drawer. For example, a column might have a custom setting for its span, which might render a slider to control it.

**enum `TypeTag`**

This is a the type of data that a custom setting can manipulate.
|Property|Description|
|--|--|
NUMBER|A simple numerical value.

---

**interface `ICustomType`**
This is a data point that can be manipulated by the custom settings controls. It includes the type of data that can be manipulated, such as `NUMBER`, and any rules associated with the setting of that data.

|Property|Type|Required|Description|
|--|--|--|--|
|type|`TypeTag`|Required|The type of data to be manipulated.
|rules|`any`|Required|Any associated rules for manipulating this data.

---

**interface `CustomTypeSetting`**

|Property|Type|Required|Description|
|--|--|--|--|
|title|`string`|Required|The human readable name of the setting.
|prop|`string`|Required|The `ContentData` property that we want to manipulate.
|type|`ICustomType`|Required|The type and rules needed to manipulate the `ContentData` property.

---

**interface `CustomTypeSettings`**

|Property|Type|Required|Description|
|--|--|--|--|
|props|`CustomTypeSetting[]`|Required|An array of custom settings for this type.

---

**`createNumberType(rules?: any)=>ICustomType`**
A utility to create a type for custom settings.

---

**Example**
Below is an example of how custom type settings can be implemented. This particular example is used to change the column span of a column.

```ts
export  const  ColumnCustomSettings:  CustomTypeSettings  = {
	props: [
		// The property we want to affect:
		// The 'span' property of the item's ContentData.
		// This will create a slider in the right drawer
		// with the range between 1 and 12, stepping 1 at a time.
		// Moving this slider will
		 automatically update the span of the column
		{
			title:  "Span",
			prop:  "span",
			type:  createNumberType({
				min:  1,
				max:  12,
				step:  1
			})
		}
	]
};
```