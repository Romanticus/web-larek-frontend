# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src\pages\index.html — HTML-файл главной страницы
- src\types\index.ts — файл с типами
- src\index.ts — точка входа приложения
- src\scss\styles.scss — корневой файл стилей
- src\utils\constants.ts — файл с константами
- src\utils\utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении
Словарь категории которая может быть у продукта
```
enum Category {
	other = 'другое',
	softSkill = 'софт-скил',
	additional = 'дополнительное',
	button = 'кнопка',
	hardSkill = 'хард-скил',
}
```
Словарь типа оплаты
```
enum PaymentType {
	cash = 'cash',
	online = 'online',
}
```
Продукт
```
interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: Category;
	price: number;
}
```
Заказ
```
interface IOrder {
	payment: PaymentType;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}
```
Интерфейс для модели данных заказа
```
interface IOrderModel {
  order:IOrder;
  addItem(item:IProduct):void;
  deleteItem(itemId:string):void;
	clearData():void;
}
```
Интерфейс для модели даннных каталога продуктов
```
interface ICatalogModel {
  items: IProduct[];
  setItems(items: IProduct[]):void;
  getProduct(id:string):IProduct;
}
```



## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:
- слой представления, отвечает за отображение данных на странице,
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы:
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

### Слой данных

#### Класс OrderData
Класс отвечает за хранение и логику работы с данными для покупки.\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:
- _order: IOrder - объект самого заказа
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Имеет методы

- addItem(item: IProduct): void - добавляет id продукта в массив items объекта `order` и вызывает событие изменения массива передавая внутрь item
- deleteItem(itemId:string):void - удаляет продукт из массива.
- clearData():void - Очищает данные объекта
- а так-же сеттеры и геттеры для изменения и получения данных из полей order и самого order

#### Класс CatalogData
Класс отвечает за хранение и логику работы с данными Продуктов.\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:
- items:IProduct[] - Массив продуктов
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Имеет методы

- setItems(items: IProduct[]):void - Устанавливает массив продуктов
- getProduct(id:string):IProduct - Возвращает продукт по id

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

### Класс Component

Абстрактный класс отвечает за работу с DOM елементами.  В конструктор принимает HTMLElement. Будет наследоваться другими следующими классами, позволяя работать с базовыми свойстами и содержит инструментарий для работы с DOM в дочерних компонентах\

Методы:
 - setDisabled(element: HTMLElement, state: boolean) - Изменение статуса блокировки
 -toggleClass(element: HTMLElement, className: string, force?: boolean)- для переключения классов
 -render(data?: Partial<T>): HTMLElement - метод для возврата корневого элемента

#### Класс Modal
Реализует модальное окно. Наследует класс Component. Так же предоставляет методы `open` и `close` для управления отображением модального окна.  Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.
- constructor(container:HTMLElement, events: IEvents) Конструктор принимает элемент разметки который и будет модальное окном и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса
- _content: HTMLElement - контент модального окна
- events: IEvents - брокер событий


#### Класс ModalConfirm

Расширяет класс Modal. Предназначен для реализации модального окна с объявлением о успешности и сумме заказа. При открытии модального окна получает данные стоимости, которое нужно отобразить\
Имееь поле
-totalSum:HTMLParagraphElement - элемент для отображения суммы заказа

Методы:
- open(data: number): void - расширение родительского метода, принимает данные, которые используются для заполнения контента элемента суммы модального окна.
- close(): void - расширяет родительский метод, выполняя дополнительно очистку атрибутов модального окна и вызывающий событие очистки форм.


#### Класс Form
Расширяет класс component. Предназначен для реализации форм ввода данных, работе с событиями. Конуструктор принимает HTMLFormElement и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- _form: HTMLFormElement - элемент формы
- _submit: HTMLButtonElement - Кнопку подтверждения
- _paymentType:PaymentType - поле отвечающее за тип покупки
- formName: string - значение атрибута name формы

Методы:

- set valid(value: boolean): void - изменяет активность кнопки
- get form: HTMLElement - геттер для получения элемента формы
- clear(): void - очищение данных форм
- render(): HTMLFormElement - Возвращение формы


#### Класс Product
Отвечает за отображение продукта, задавая в карточке данные. Класс используется для отображения продукта на странице сайта. В конструктор класса передается DOM элемент темплейта. В классе устанавливаются необходимые слушатели\
Поля класса содержат элементы разметки элементов продукта. Конструктор, кроме темплейта принимает экземпляр `EventEmitter` для инициации событий.\
Методы:
- setData(product: IProduct, Order:IOrder): void - заполняет темплейт данными, а так-же управляет отображением кнопки добавления на основании данных о нахождении в заказе элемента.Кнопка будет менять и не доступна, если товар уже есть.
- render(): HTMLElement - метод возвращает полностью заполненную карточку с установленными слушателями
- геттер id возвращает уникальный id карточки

#### Класс ProductContainer
Отвечает за отображение блока с карточками на главной странице. В конструктор принимает контейнер, в котором размещаются Продукты.

#### Класс Order
Отвечает за блок сайта с информацией о заказанных продуктах. Отображает прдукты в заказе. Принимает в конструктор контейнер - элемент разметки блока профиля и экземпляр `EventEmitter` для инициации событий при нажатии пользователем на кнопки. Устанавливает в конструкторе слушатели на все кнопки, при срабатывании которых генерируются соответствующие события\
В полях класса содержатся ссылки на все элементы разметки блока.\
 - products: Product[] - содержит продукты которые отображаются в заказе
Методы:
- addProduct(product: IProduct): void - Добавляет продукт в  разметку блока
- deleteProduct (id:string):void - Позволяет удалить элемент
- clear():void - Очищает полностью заказ



### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- `product:changed` - изменение данных пользователя
- `order:changed` - изменение массива карточек
- `product:selected` - изменение открываемой в модальном окне картинки карточки
- `product:previewClear` - необходима очистка данных выбранной для показа в модальном окне карточки

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `modalConfirm:open` - открытие модального окна с формой подтвержденной покупкой
- `modal:open` - открытие модального окна
- `modal:close` - событие закрытия модального окна
- `order:add` - событие добавления товара в заказ
- `order:delete` - событие удаления товара из заказа
- `order:clear` - событие очистки заказа
- `order:submit` - событие подтверждения данных адреса и типа покупки
- `order:confirm` - событие подтверждения заказа
- `catalog:select` - выбран продукт
- `preview:changed` - изменен открытый продукт
- `product:buyed` - изменение состояния кнопки покупки на продукте
- `contacts:submit` - сохранение данных пользователя в модальном окне
- `address:change` -  изменение данных адреса
- `card:change` -  изменение данных типа покупки
- `cash:change` -  изменение данных типа покупки
- `email:change` -  изменение данных почты
- `phont:change` -  изменение данных телефона
