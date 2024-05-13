import { AppAPI } from './components/AppAPI';

import { CatalogData } from './components/CatalogData';
import { FormAddres } from './components/FormAddres';
import { OrderData } from './components/OrderData';
import { PreviewProduct } from './components/PreviewProduct';
import { Product } from './components/Product';
import { ItemsContainer } from './components/ItemsContainer';
import { EventEmitter } from './components/base/Events';
import { Form } from './components/common/Form';
import { Modal } from './components/common/Modal';
import { Success } from './components/common/Success';
import './scss/styles.scss';
import { IProduct, IFormAddres, IFormUser, IOrder } from './types';
import { CDN_URL, API_URL } from './utils/constants';
import { cloneTemplate, ensureAllElements, ensureElement } from './utils/utils';
import { BasketItemView } from './components/BasketItemView';
import { BasketView } from './components/BasketView';

const events = new EventEmitter();

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const api = new AppAPI(CDN_URL, API_URL);

const orderData = new OrderData(events);
const catalogData = new CatalogData(events);

const pageM = ensureElement<HTMLElement>('.page__wrapper');
const basketOpenButton = ensureElement<HTMLButtonElement>('.header__basket');
const basketCounter = ensureElement<HTMLElement>('.header__basket-counter');

const formAddressTemplate = ensureElement<HTMLTemplateElement>('#order');
const formUserTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const productPreviewTemplate =
	ensureElement<HTMLTemplateElement>('#card-preview');
const productCatalogTemplate =
	ensureElement<HTMLTemplateElement>('#card-catalog');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const gallery = ensureElement<HTMLElement>('.gallery');
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const productCatalog = new ItemsContainer(gallery);

const basketOrdersCatalog = new BasketView(
	cloneTemplate(basketTemplate),
	events
);

const previewProduct = new PreviewProduct(
	cloneTemplate(productPreviewTemplate),
	events
);

const addressForm = new FormAddres(cloneTemplate(formAddressTemplate), events);
const userForm = new Form<IFormUser>(cloneTemplate(formUserTemplate), events);

events.on(
	/^[a-z]*\..*:change/,
	(data: { field: keyof IFormAddres | keyof IFormUser; value: string }) => {
		orderData.setOrderField(data.field, data.value);
	}
);

events.on('formAddressErrors:change', (errors: Partial<IFormAddres>) => {
	const { payment, address } = errors;
	addressForm.valid = !payment && !address;
	addressForm.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

events.on('formUserErrors:change', (errors: Partial<IFormUser>) => {
	const { email, phone } = errors;
	userForm.valid = !email && !phone;
	userForm.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

events.on('order:confirm', () => {
	modal.render({
		content: addressForm.render({

			valid: false,
			errors: [],
		}),
	});
});

events.on('contacts:submit', () => {
	orderData.order.items = orderData.order.items.filter((item) => {
		const fullItem = catalogData.getProduct(item);

		return fullItem.price != null;
	});
	events.emit('order:changed', orderData.order);

	api
		.order(orderData.order)
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});

			modal.render({
				content: success.render({ total: result.total }),
			});
      userForm.clearForm();
      addressForm.clearForm();
			orderData.clearData();

		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('order:submit', () => {
	modal.render({
		content: userForm.render({
			valid: false,
			errors: [],
		}),
	});
});

api
	.getProductList()
	.then((result) => {
		catalogData.items = result as IProduct[];
	})
	.catch((err) => {
		console.error(err);
	});

events.on('product:changed', (items: IProduct[]) => {
	productCatalog.catalog = items.map((item) => {
		const card = new Product(cloneTemplate(productCatalogTemplate), events, {
			onClick: () => events.emit('catalog:select', { id: item.id }),
		});

		return card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			id: item.id,
			category: item.category,
			price: item.price,
		});
	});
});

events.on('catalog:select', (data: { id: string }) => {
	const item = catalogData.getProduct(data.id);
	modal.render({
		content: previewProduct.render({
			title: item.title,
			image: item.image,
			description: item.description,
			id: item.id,
			category: item.category,
			price: item.price,
		}),
	});
	previewProduct.yetBuyed(
		orderData.order.items.some((id) => {
			return id == data.id;
		})
	);
  previewProduct.isUnvaible()

});

function pagelocked(value: boolean) {
	if (value) {
		pageM.classList.add('page__wrapper_locked');
	} else {
		pageM.classList.remove('page__wrapper_locked');
	}
}
events.on('modal:open', () => {
	pagelocked(true);
});

events.on('modal:close', () => {
	pagelocked(false);
});

basketOpenButton.addEventListener('click', () => {
	events.emit('order:changed', orderData.order);

	modal.render({
		content: basketOrdersCatalog.render(),
	});
});

events.on('order:changed', (order: IOrder) => {
	let newTotal = 0;
	const newItems = order.items.map((item, index) => {
		const product = catalogData.getProduct(item);
		newTotal += product.price;
		const prodctBuscket = new BasketItemView(
			cloneTemplate(basketItemTemplate),
			events
		);
		Object.assign(product, { index: index + 1 });
		return prodctBuscket.render(product);
	});

	basketCounter.textContent = `${newItems.length}`;
  orderData.order.total=newTotal;
	basketOrdersCatalog.render({
		total: newTotal,
		items: newItems,
	});
});

events.on('order:add', (data: { product: IProduct }) => {
	orderData.addItem(catalogData.getProduct(data.product.id));
	modal.close();
});
events.on('order:delete', (data: { id: string }) => {
	orderData.deleteItem(data.id);

});
