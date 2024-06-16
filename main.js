class Actor extends EventTarget {
  name;
  value;

  /**
   * Create an actor
   *
   * @param {string|EventTarget} element
   */
  constructor(elementOrName) {
    super();

    if (elementOrName instanceof EventTarget) {
      this.name = elementOrName.name;
      this.value = elementOrName.value;

      elementOrName.addEventListener('input', () => {
        this.value = elementOrName.value;

        this.dispatchEvent(new Event('change'));
      });
    } else {
      this.name = elementOrName;
    }
  }
}

const Alignment = Object.freeze({ Evil: 'evil', Good: 'good', Neutral: 'neutral' });

class AlignmentActor extends Actor {
  constructor(...args) {
    super(...args);

    document.getElementById('alignment').addEventListener('click', (e) => {
      if (e.target instanceof HTMLDivElement) {
        this.change(e.target.dataset.value);

        this.dispatchEvent(new Event('change'));
      }
    });
  }

  change(alignment) {
    const nodes = document.getElementById('alignment').querySelectorAll('div')

    switch (alignment) {
      case Alignment.Evil:
        nodes[0].style.border = '';
        nodes[1].style.border = '';
        nodes[2].style.border = '1px solid red';
        break;
      case Alignment.Good:
        nodes[0].style.border = '1px solid green';
        nodes[1].style.border = '';
        nodes[2].style.border = '';
        break;
      case Alignment.Neutral:
        nodes[0].style.border = '';
        nodes[1].style.border = '1px solid yellow';
        nodes[2].style.border = '';
        break;
      default:
        throw new Error('Invalid alignment: ' + alignment);
    }

    this.value = alignment;
  }
}

class Form {
  #observers = [];
  /**
   * @type {Map<Actor>}
   */
  #fields = new Map();

  /**
   * Attach form to instance
   *
   * @param {HTMLFormElement} form form element
   */
  constructor(form) {
    for (let i = 0; i < form.elements.length; i++) {
      this.register(new Actor(form.elements[i]));
    }
  }

  change(fieldName, value) {
    this.#fields.get(fieldName).change(value);
  }

  /**
   * Add an observer to every change
   *
   * @param {Function} handler called every time a change happens
   */
  observe(handler) {
    this.#observers.push(handler);
  }

  /**
   * Register a new field actor
   *
   * @param {EventTarget} actor
   */
  register(actor) {
    this.#fields.set(actor.name, actor);

    actor.addEventListener('change', (e) => {
      this.#observers.forEach((observer) =>
        observer(
          e.target.name,
          e.target.value,
          Array
            .from(this.#fields.values())
            .reduce((acc, actor) => ({ ...acc, [actor.name]: actor.value }))
        )
      );
    });
  }
}

const form = new Form(document.querySelector('form'));

form.register(new AlignmentActor('alignment'));

form.observe(console.log);
