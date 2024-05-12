import { IProduct } from '../types';
import { Component } from './base/Component';
import { IEvents } from './base/Events';

interface IProductActions {
	onClick: (event: MouseEvent) => void;
}

export class Product extends Component<IProduct> {
	protected events: IEvents;
	itemDescription: string;
	itemPrice: number;
	public productId: string;
	protected productCategory: HTMLElement;
	protected productTitle: HTMLElement;
	protected productImage: HTMLImageElement;
	protected productPrice: HTMLElement;

	constructor(
		protected container: HTMLElement,
		events: IEvents,
		actions?: IProductActions
	) {
		super(container);
		this.events = events;

		this.productCategory = this.container.querySelector('.card__category');
		this.productTitle = this.container.querySelector('.card__title');
		this.productImage = this.container.querySelector('.card__image');
		this.productPrice = this.container.querySelector('.card__price');

		if (actions?.onClick) {
			this.container.addEventListener('click', actions.onClick);
		}

		// this.container.addEventListener('click',()=>{
		//   this.events.emit('catalog:select', { id:this.id});

		// })
	}
	set image(src: string) {
		this.setImage(this.productImage, src);
	}

	set description(value: string) {
		this.itemDescription = value;
	}

	get description() {
		return this.itemDescription;
	}

	set price(value: number) {
		this.itemPrice = value;
		if (value == null) {
			this.setText(this.productPrice, `Бесценно`);
		} else this.setText(this.productPrice, `${value} синапсов`);
	}

	get price() {
		return this.itemPrice;
	}

	set category(category: string) {
		switch (category) {
			case 'софт-скил':
				this.toggleClass(this.productCategory, 'card__category_soft', true);
				break;
			case 'хард-скил':
				this.toggleClass(this.productCategory, 'card__category_hard', true);
				break;
			case 'другое':
				this.toggleClass(this.productCategory, 'card__category_other', true);
				break;
			case 'дополнительное':
				this.toggleClass(
					this.productCategory,
					'card__category_additional',
					true
				);
				break;
			case 'кнопка':
				this.toggleClass(this.productCategory, 'card__category_button', true);
				break;
		}
		this.setText(this.productCategory, category);
	}

	set title(title: string) {
		this.setText(this.productTitle, title);
	}

	set id(id: string) {
		this.productId = id;
	}

	get id() {
		return this.productId;
	}
}
