import { Component } from './base/Component';

export interface IViewItemsContainer {
	catalog: HTMLElement[];
}

export class ItemsContainer extends Component<IViewItemsContainer> {
	protected _catalog: HTMLElement[];

	constructor(protected container: HTMLElement) {
		super(container);
	}
	set catalog(items: HTMLElement[]) {
		this.container.replaceChildren(...items);
	}
}
