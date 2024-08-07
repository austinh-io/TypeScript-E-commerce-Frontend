import { VariantProperty } from "../utils/types/VariantProperty";

export class ProductVariant {
  private _variantId: string = '0';
  private _variantName: string | null = null;
  private _variantDescription: string | null = null;
  private _variantPrice: number | null = null;
  private _variantProperties: { [key: string]: VariantProperty } = {};

  constructor(id: string, name?: string, description?: string, price?: number) {
    this.id = id;
    if (name) this.name = name;
    if (description) this.description = description;
    if (price) this.price = price;
  }

  get id(): string {
    return this._variantId;
  }

  set id(value: string) {
    this._variantId = value;
  }

  get name(): string | null {
    return this._variantName;
  }

  set name(value: string) {
    this._variantName = value;
  }

  get description(): string | null {
    return this._variantDescription;
  }

  set description(value: string) {
    this._variantDescription = value;
  }

  get price(): number | null {
    return this._variantPrice;
  }

  set price(value: number) {
    this._variantPrice = value;
  }

  get properties(): { [key: string]: VariantProperty } {
    return this._variantProperties;
  }

  set properties(value: { [key: string]: VariantProperty }) {
    this._variantProperties = value;
  }

  addProperty(name: string, value: VariantProperty) {
    this._variantProperties[name] = value;
  }

  removeProperty(key: string) {
    if (this.hasProperty(key)) {
      delete this._variantProperties[key];
    }
  }

  hasProperty(key: string): boolean {
    return key in this._variantProperties;
  }
}
