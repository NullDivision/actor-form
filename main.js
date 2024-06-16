class Form {
  /**
   * @type {HTMLFormElement}
   */
  #form;
  #observers = [];

  /**
   * Attach form to instance
   *
   * @param {HTMLFormElement} form form element
   */
  constructor(form) {
    this.#form = form;

    this.#form.addEventListener('input', (e) => {
      this.#observers.forEach((observer) =>
        observer(e.target.name, e.target.value, new FormData(form))
      );
    });
  }

  change(fieldName, value) {
    console.log(this.#form)

    this.#form.elements.namedItem(fieldName).value = value;
  }

  /**
   * Add an observer to every change
   *
   * @param {Function} handler called every time a change happens
   */
  observe(handler) {
    this.#observers.push(handler);
  }
}

const form = new Form(document.querySelector('form'));

form.observe(console.log);
