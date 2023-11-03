import {
  baseUrl,
  catalogProducts,
} from '/scripts/utilities/commerceUtilities.js';

('use strict');

const tpl_radioFieldset = document.createElement('template');

const tpl_radioFieldsetCSS = `
<style>
    @import url(${baseUrl}/css/main.css);

    .option-fieldset-container {
      display: flex;
    }

    fieldset.option-fieldset {
      display: flex;
      align-items: center;
      justify-content: start;
      flex-wrap: wrap;

      gap: 0.6rem;

      padding-inline: 0;

      border: 0;
    }

    .option-fieldset {
      margin-right: 2.6rem;
    }

    .option-fieldset:last-child {
      margin-right: 0;
    }

    .option-fieldset input[type='radio'] {
      appearance: none;
      width: 1.4rem;
      height: 1.4rem;
      outline-offset: 1px;
      border-radius: 50%;
      cursor: pointer;
      border: 1px solid var(--color-font);

      outline: 3px solid rgba(0, 0, 0, 0);


      transition: all 0.1s ease-out;
    }

    .option-fieldset input[type='radio']:hover {
      outline: 3px solid var(--color-accent);
      border: none;
    }

    .option-fieldset input[type='radio']:checked {
      outline: 3px solid var(--color-font, currentColor);
      border: none;
    }

    .option-fieldset input[type='radio']:checked:hover {
      outline: 3px solid var(--color-font, currentColor);
      cursor: default;
      border: none;
    }

    .option-fieldset input[type='radio']:disabled {
      border: 1px solid green;
    }

    .option-fieldset input[type='radio']:disabled:hover {
      cursor: default;
      outline: none;

    }

    .option-fieldset input[type='radio']#light {
      --radio-color: rgb(223, 232, 238);
    }

    .option-fieldset input[type='radio']#dark {
      --radio-color: rgb(23, 28, 32);
    }
</style>
`;

function createAttributeSelectors(product) {
  let html = '';
  let attributes = {};

  // Gather all unique attributes
  product.options.forEach((option) => {
    option.attributes.forEach((attr) => {
      if (!attributes[attr.name]) {
        attributes[attr.name] = { type: attr.type, values: new Set() };
      }
      attributes[attr.name].values.add(attr.value);
    });
  });

  // Create HTML for each attribute
  for (let name in attributes) {
    if (attributes[name].type == 'radio' && attributes[name].values.size > 1) {
      html += `<fieldset class="option-fieldset"><legend>${name}</legend>`;
      attributes[name].values.forEach((value) => {
        html += `<input type="radio" id="${value}" name="${name}" value="${value}" title="${value}">
                   <label for="${value}" class="hidden">${value}</label>`;
      });
      html += `</fieldset>`;
    }
  }

  return html;
}

function calculateAvailableAttributes(selectedOption, product) {
  // let availableAttributes = new Array();
  // console.log('Selected Attributes');
  // console.log(selectedOption.attributes);

  // console.log('All Attributes');
  // for (let selectedOptionAttribute of selectedOption.attributes) {
  //   console.log('---------SELECTED OPTION ATTRIBUTE---------');
  //   console.log(selectedOptionAttribute);
  //   for (let option of product.options) {
  //     console.log('-----OPTION-----');
  //     console.log(option);
  //     if (option !== selectedOption) {
  //       for (let attribute of option.attributes) {
  //         console.log('---ATTRIBUTE---');
  //         console.log(attribute);
  //         if (attribute.name !== selectedOptionAttribute.name) {
  //           // if (option.attributes.some((att) => att === attribute)) {
  //           //   availableAttributes.push(attribute);
  //           // }
  //           console.log(
  //             option.attributes.some((att) => att === selectedOptionAttribute)
  //           );
  //           if (
  //             option.attributes.some((att) => att === selectedOptionAttribute)
  //           ) {
  //             console.log(
  //               '-option.attributes.some((att) => att === selectedOption)-'
  //             );
  //             console.log(attribute);
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

  // console.log('availableAttributes');
  // console.log(availableAttributes);
  // return availableAttributes;

  const productOptions = product.options;
  const currentOption = selectedOption;
  // const currentState = currentOption.attributes;

  let currentState = currentOption.attributes.reduce((state, attribute) => {
    state[attribute.name] = attribute.value;
    return state;
  }, {});

  console.log('currentState');
  console.log(currentState);

  // Define a helper function to check compatibility
  const isOptionCompatible = (
    option,
    attributeNameToCheck,
    currentAttributes
  ) => {
    return currentAttributes.every(({ name, value }) => {
      // Skip the attribute if it's the one we're checking compatibility for
      if (name === attributeNameToCheck) return true;

      // Check if the option has an attribute with the same name and value as the current attribute
      const attribute = option.attributes.find((attr) => attr.name === name);
      return attribute && attribute.value === value;
    });
  };

  // Convert currentState to an array of attributes
  const currentAttributes = Object.keys(currentState).map((name) => ({
    name,
    value: currentState[name],
  }));

  // Dynamically create the structure for validAttributes based on current attributes
  let validAttributes = currentAttributes.reduce((acc, attr) => {
    acc[attr.name] = [];
    return acc;
  }, {});

  // Go through each attribute in the currentState and populate validAttributes
  for (const attributeName in validAttributes) {
    productOptions.forEach((option) => {
      option.attributes.forEach((attribute) => {
        if (
          attribute.name === attributeName &&
          !validAttributes[attributeName].includes(attribute.value) &&
          isOptionCompatible(option, attributeName, currentAttributes)
        ) {
          validAttributes[attributeName].push(attribute.value);
        }
      });
    });
  }

  let availableOptions = validAttributes;

  console.log('availableOptions');
  console.log(availableOptions);
}

tpl_radioFieldset.innerHTML = `
${tpl_radioFieldsetCSS}
<div class="option-fieldset-container">
</div>
`;

class radioFieldset extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const clone = tpl_radioFieldset.content.cloneNode(true);
    shadow.append(clone);

    this.productId = this.getAttribute('productid');
    this.optionFieldsetContainer = this.shadowRoot.querySelector(
      '.option-fieldset-container'
    );
    this.product = catalogProducts.find(
      (product) => product.productId == this.productId
    );
  }

  setAvailableOptions(selectedOption) {
    // console.log('Radio Fieldset: Set Available Options');
    // console.log('selectedOption');
    // console.log(selectedOption);

    // Calculate availableAttributes based on selectedOption and product
    let availableAttributes = calculateAvailableAttributes(
      selectedOption,
      this.product
    );

    // console.log('Selected Option');
    // console.log(selectedOption);

    // console.log('Available Attributes');
    // console.log(availableAttributes);

    // Update attribute selectors
    // for (let attribute of selectedOption.attributes) {
    //   if (attribute.type === 'radio') {
    //     let fieldsets = Array.from(
    //       this.shadowRoot.querySelectorAll('.option-fieldset')
    //     );
    //     let fieldset = fieldsets.find(
    //       (fs) => fs.querySelector('legend').textContent === attribute.name
    //     );
    //     if (fieldset) {
    //       let radioButtons = Array.from(
    //         fieldset.querySelectorAll('input[type="radio"]')
    //       );
    //       for (let radioButton of radioButtons) {
    //         if (availableAttributes[attribute.name].has(radioButton.value)) {
    //           radioButton.disabled = false;
    //         } else {
    //           radioButton.disabled = true;
    //         }
    //       }
    //     }
    //   }
    // }
  }

  connectedCallback() {
    let html = createAttributeSelectors(this.product);
    this.optionFieldsetContainer.innerHTML = html;

    let optionFieldsets = Array.from(
      this.shadowRoot.querySelectorAll('fieldset.option-fieldset')
    );
    let radioButtons = Array.from(
      this.shadowRoot.querySelectorAll('input[type="radio"]')
    );

    for (let optionFieldset of optionFieldsets) {
      let _radioButtons = Array.from(
        optionFieldset.querySelectorAll('input[type="radio"]')
      );
      for (let _radioButton of _radioButtons) {
        if (_radioButtons.indexOf(_radioButton) == 0) {
          _radioButton.checked = true;
        }
      }
    }

    radioButtons.forEach((radioButton) => {
      radioButton.addEventListener('click', function (event) {
        let attributeSelectedEvent = new CustomEvent('attribute-selected', {
          detail: {
            name: this.name,
            value: this.value,
          },
          bubbles: true,
          composed: true,
        });
        this.dispatchEvent(attributeSelectedEvent);
        console.log('Radio Fieldset Attribute Selected');
      });
    });

    let selector = this.shadowRoot.querySelector(`#color`);
  }
}

window.customElements.define('radio-fieldset', radioFieldset);
