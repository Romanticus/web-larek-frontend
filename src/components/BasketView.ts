import { createElement } from '../utils/utils';
import { IViewItemsContainer, ItemsContainer } from './ItemsContainer';
import { Component } from './base/Component';
import { IEvents } from './base/Events';

interface IBasketView {
	total: number;
	items: HTMLElement[];
}

export class BasketView extends Component<IBasketView> {
	protected basketPrice: HTMLElement;
	protected basketButton: HTMLButtonElement;
	protected basketList: IViewItemsContainer;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this.basketPrice = this.container.querySelector('.basket__price');
		this.basketButton = this.container.querySelector('.basket__button');
		this.basketList = new ItemsContainer(
			this.container.querySelector('.basket__list')
		);

		this.basketButton.addEventListener('click', () => {
			this.events.emit('order:confirm');
		});
	}

	set total(total: number) {
		this.setText(this.basketPrice, `${total} синапсов`);
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this.setDisabled(this.basketButton, false);
			this.basketList.catalog = items;
		} else {
			this.setDisabled(this.basketButton, true);
			this.container.querySelector('.basket__list').replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}
}
