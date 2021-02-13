# Interface Actions

The default Interface Action Listener is configured to handle commands raised to the [Event-Action Bus](/actions/event-bus).

---

## Commands

### set-theme

Sets the main page theme to dark or light.

**data:**

- **theme** 'dark|light' (required)

### set-auto-play

Sets wether or not videos and audio can automatically play when a new route is activated.

**data:**

- **autoPlay** boolean (required)

### set-sound

Sets wether or not audio is played globally for audio and videos.

**data:**

- **muted** boolean (required)

---

## DOM Commands

### element-toggle-class

Toggles a given class on or off.

**data:**

- **id** (required)
- **className** (required)

### element-add-classes

Add a class or classes to a specified element.

**data:**

- **selector** (required)
- **classes** (required)

### element-remove-classes

Remove a class or classes to a specified element.

**data:**

- **selector** (required)
- **classes** (required)

### element-set-attribute

Add an attribute to a specified element.

**data:**

- **selector** (required)
- **attribute** (required)
- **value**

### element-remove-attribute

Remove an attribute from the specified element.

**data:**

- **selector** (required)
- **classes** (required)

### element-call-method

Call a method on an element with optional arguments.

**data:**

- **selector** (required)
- **method** (required)
- **args**
