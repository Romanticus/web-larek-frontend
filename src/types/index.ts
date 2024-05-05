enum Category {
	other = 'другое',
	softSkill = 'софт-скил',
	additional = 'дополнительное',
	button = 'кнопка',
	hardSkill = 'хард-скил',
}

enum PaymentType {
	cash = 'money',
	online = 'online',
}

interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: Category;
	price: number;
}

interface IOrder {
	payment: PaymentType;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

interface IOrderModel {
  order:IOrder;
  addItem(item:IProduct):void;
  deleteItem(itemId:string):void;
	clearData():void;
}

interface ICatalogModel {
  items: IProduct[];
  setItems(items: IProduct[]):void;
  getProduct(id:string):IProduct;
}

