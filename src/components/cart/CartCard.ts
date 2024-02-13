import { Product } from '../../models/product';
import { Cart } from '../../utils/core/cartManager';

const TPL_CartCard = document.createElement('template');

const TPL_CartCard_css = /* CSS */ `
<style>
    :host {
        overflow: hidden;
        border-radius: 4px;
    }

    .container {
        position: relative;
        height: 5rem;
        padding: 1.2rem;
    }

    .container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.4;
        background: var(--color-surface-400);
    }

    .cart-card-image-container {
        width: 4rem;
        height: 4rem;
        background: var(--color-tertiary-500);
        opacity: 0.5;
    }

    h1, h2, h3, h4, h5, h6, p {
        margin: 0;
        padding: 0;
    }

    .grid-container {
        display: grid;
        grid-template-columns: auto auto auto;
        gap: 1rem;
        align-items: center;
        justify-content: space-between;
    }

    .grid-item {

    }
</style>
`;

TPL_CartCard.innerHTML = /* HTML */ `
  ${TPL_CartCard_css}

  <div class="container grid-container">
    <div class="grid-item">
      <div class="cart-card-image-container"></div>
    </div>
    <div class="grid-item">
      <h4 id="title">Cart Item</h4>
      <p id="description">Lorem Ipsum</p>
      <p id="price">$0.00</p>
    </div>
    <div class="grid-item">
      <app-button
        iconType="solid"
        iconName="trash"
        size="sm"
        id="btn-remove"></app-button>
    </div>
  </div>
`;

class CartCard extends HTMLElement {
  private _cartItem: Product;
  private _titleLabel: HTMLElement;
  private _descriptionLabel: HTMLElement;
  private _priceLabel: HTMLElement;
  private _removeButton: HTMLElement;

  constructor(cartItem: Product) {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const clone = TPL_CartCard.content.cloneNode(true);
    shadow.append(clone);

    this._titleLabel = shadow.querySelector('#title')!;
    this._descriptionLabel = shadow.querySelector('#description')!;
    this._priceLabel = shadow.querySelector('#price')!;
    this._removeButton = shadow.querySelector('#btn-remove')!;

    this._cartItem = cartItem;
    this.productId = String(cartItem.id);
    this.productName = cartItem.name;
    this.productDescription = cartItem.description;
    this.productPrice = cartItem.price;

    this._titleLabel.innerText = this.productName;
    this._descriptionLabel.innerText = this.productDescription;
    this._priceLabel.innerText = this.productPrice;
  }

  get cartItem(): Product | null {
    return this._cartItem;
  }

  set cartItem(value: Product) {
    this._cartItem = value;
    this.productId = value.id;
    this.updateItemLabels();
  }

  get productId(): string | null {
    return this.getAttribute('itemId');
  }

  set productId(value: string | number) {
    this.setAttribute('itemId', String(value));
  }

  get productName(): string | null {
    return this.getAttribute('itemName');
  }

  set productName(value: string) {
    this.setAttribute('itemName', value);
  }

  get productDescription(): string | null {
    return this.getAttribute('itemDescription');
  }

  set productDescription(value: string) {
    this.setAttribute('itemDescription', value);
  }

  get productPrice(): string {
    return this.getAttribute('itemPrice')!;
  }

  set productPrice(value: number) {
    this.setAttribute('itemPrice', String(value));
  }

  connectedCallback() {
    this._removeButton.addEventListener('click', () => this.removeItem());
  }

  updateItemLabels() {
    this._titleLabel.innerText = this.productName!;
    this._descriptionLabel.innerText = this.productDescription!;
    this._priceLabel.innerText = this.productPrice!;
  }

  removeItem() {
    Cart.removeItem(this._cartItem.id);
    this.remove();
  }

  disconnectedCallback() {
    this._removeButton.removeEventListener('click', () => this.removeItem());
  }
}

window.customElements.define('cart-card', CartCard);

export default CartCard;
