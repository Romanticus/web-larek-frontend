import { ICatalogModel, IProduct } from '../types';
import { IEvents } from './base/Events';

export class CatalogData implements ICatalogModel {
	protected _items: IProduct[];
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	set items(items: IProduct[]) {
		this._items = items;
		this.events.emit('product:changed', items);
	}

	get items() {
		return this._items;
	}

	getProduct(id: string): IProduct {
		return this.items.find((item) => item.id == id);
	}
}
