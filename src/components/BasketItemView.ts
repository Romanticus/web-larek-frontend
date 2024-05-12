import { IProduct } from '../types';
import { Component } from './base/Component';
import { IEvents } from './base/Events';

export class BasketItemView extends Component<IProduct> {
	protected itemTitle: HTMLElement;
	protected itemPrice: HTMLElement;
	protected itemId: string;
	protected itemIndex: HTMLElement;
	protected itemDeleteButton: HTMLButtonElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);

		this.itemTitle = this.container.querySelector('.card__title');
		this.itemPrice = this.container.querySelector('.card__price');
		this.itemIndex = this.container.querySelector('.basket__item-index');
		this.itemDeleteButton = this.container.querySelector(
			'.basket__item-delete'
		);

		this.itemDeleteButton.addEventListener('click', () => {
			this.events.emit('order:delete', { id: this.itemId });
		});
	}

	set id(value: string) {
		this.itemId = value;
	}

	set title(title: string) {
		this.setText(this.itemTitle, title);
	}
	set price(price: string) {
		if (!price) {
			this.setText(this.itemPrice, `Бессценно`);
		} else this.setText(this.itemPrice, `${price} синапсов`);
	}

	set index(index: string) {
		this.setText(this.itemIndex, index);
	}
}
