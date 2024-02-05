import { currentTheme } from '../../utils/themeManager';

const TPL_SiteNav = document.createElement('template');

const TPL_SiteNav_css = /* CSS */ `
<style>
    :host {
      width: 100%;
      margin-block: auto;
    }
    nav {
      display: flex;
      align-items: center;
    }

    ul {
      display: flex;
      gap: 1rem;


      list-style: none;
    }

    a {
      color: var(--theme-font-color-base);
      text-decoration: none;
    }

    a:hover {
      color: var(--color-primary-300);
    }

    .wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;

      margin-inline: auto;

      width: 100%;
      max-width: 1240px;
    }

    .menu-button {
      display: flex;
      align-items: center;
      justify-content: center;

      border: none;
      padding: 0;
      margin: 0;

      width: 2rem;
      height: 2rem;
      background: none;

      cursor: pointer;
    }
</style>
`;

TPL_SiteNav.innerHTML = /* HTML */ `
  ${TPL_SiteNav_css}

  <nav>
    <div class="wrapper">
      <h3>Navigation Component</h3>
      <ul>
        <li>
          <a href="#">Link 1</a>
        </li>
        <li>
          <a href="#">Link 2</a>
        </li>
        <li>
          <a href="#">Link 3</a>
        </li>
      </ul>
      <button class="menu-button">
        <box-icon
          name="menu"
          size="lg"
          color="">
        </box-icon>
      </button>
    </div>
  </nav>
`;

class SiteNav extends HTMLElement {
  private _boxicon: HTMLElement;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const clone = TPL_SiteNav.content.cloneNode(true);
    shadow.append(clone);
    this._boxicon = shadow.querySelector('box-icon')!;
  }

  connectedCallback() {
    document.addEventListener('themeChanged', () => {
      this.updateIconColor();
    });
    this.updateIconColor();
  }

  updateIconColor() {
    this._boxicon.setAttribute(
      'color',
      currentTheme.theme.properties['--theme-font-color-base']
    );
  }
}

window.customElements.define('site-nav', SiteNav);

export default SiteNav;