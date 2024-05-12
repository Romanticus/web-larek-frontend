import { ApiListResponse, IOrder, IOrderResult, IProduct } from '../types';
import { Api } from './base/Api';

export interface IAppAPI {
	getProductList: () => Promise<IProduct[]>;
	order: (order: IOrder) => Promise<IOrderResult>;
}

export class AppAPI extends Api implements IAppAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	order(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
