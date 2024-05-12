import {
	FormErrors,
	IFormAddres,
	IFormUser,
	IOrder,
	IOrderModel,
	IProduct,
	PaymentType,
} from '../types';
import { IEvents } from './base/Events';

export class OrderData implements IOrderModel {
	protected _order: IOrder;
	protected events: IEvents;
	protected formErrors: FormErrors = {};

	constructor(events: IEvents) {
		this.events = events;
		this._order = {
			payment: undefined,
			email: '',
			phone: '',
			address: '',
			total: 0,
			items: [],
		};
	}

	get order() {
		return this._order;
	}

	addItem(item: IProduct) {
		this._order.items.unshift(item.id);
		this._order.total += item.price;
		this._changed();
	}

	deleteItem(itemId: string) {
		this._order.items = this._order.items.filter((item) => item != itemId);
		this._changed();
	}

	clearData() {
		this._order = {
			payment: undefined,
			email: '',
			phone: '',
			address: '',
			total: 0,
			items: [],
		};
		this._changed();
	}
	setOrderField(
		field: keyof IFormAddres | keyof IFormUser,
		value: PaymentType | string
	) {
		if (field === 'payment') {
			this._order[field] = value as PaymentType;
		} else {
			this._order[field] = value;
		}

		this.validateOrder();

		this._changed();
	}

	validateAddres() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо выбрать тип оплаты';
		}
		this.formErrors = errors;
		this.events.emit('formAddressErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateUser() {
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formUserErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateOrder() {
		const resAd = this.validateAddres();
		const resUs = this.validateUser();
		return resAd && resUs;
	}

	protected _changed() {
		this.events.emit('order:changed', this.order);
	}
}
