export enum PaymentType {
	cash = 'cash',
	card = 'card',
}

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IOrder {
	payment: PaymentType | undefined;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export interface IOrderResult {
	id: string;
	total: number;
}

export interface IOrderModel {
	order: IOrder;
	addItem(item: IProduct): void;
	deleteItem(itemId: string): void;
	clearData(): void;
	setOrderField(
		field: keyof IFormAddres | keyof IFormUser,
		value: PaymentType | string
	): void;
	validateOrder(): boolean;
}

export interface ICatalogModel {
	items: IProduct[];
	getProduct(id: string): IProduct;
}

export interface IFormAddres {
	payment: string;
	address: string;
}

export interface IFormUser {
	email: string;
	phone: string;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};
