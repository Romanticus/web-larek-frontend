import { IFormAddres, PaymentType } from '../types';
import { ensureAllElements } from '../utils/utils';
import { IEvents } from './base/Events';
import { Form } from './common/Form';

export class FormAddres extends Form<IFormAddres> {
	protected typePaymentButtons: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.typePaymentButtons = ensureAllElements<HTMLButtonElement>(
			'button[type="button"]',
			this.container
		);

		this.typePaymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.onInputChange('payment', button.name as PaymentType);
				this.selectTypePayment(button.name);
			});
		});
	}

	selectTypePayment(name: string) {
		this.typePaymentButtons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name == name);
		});
	}
}
