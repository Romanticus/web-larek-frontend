import { Product } from './Product';
import { IEvents } from './base/Events';

export class PreviewProduct extends Product {
	protected cardText: HTMLElement;
	protected cardButton: HTMLButtonElement;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container, events);

		this.cardText = this.container.querySelector('.card__text');
		this.cardButton = this.container.querySelector('.card__button');


      this.cardButton.addEventListener('click', () => {
			this.events.emit('order:add', { product: this });
			this.yetBuyed(true);
		})


	}

  isUnvaible():boolean{
    if(this.price == null){
      this.setDisabled(this.cardButton,true);
			this.setText(this.cardButton, 'Товар Бесценен!');
      return true
    }
    return false

  }

	yetBuyed(bool: boolean) {

    if (bool) {
			this.setDisabled(this.cardButton, true);
			this.setText(this.cardButton, 'Уже в корзине');
		} else {
			this.setDisabled(this.cardButton, false);
			this.setText(this.cardButton, 'В корзину');
		}
	}

	set description(description: string) {
		this.setText(this.cardText, description);
	}
}
