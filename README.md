# MHQ is a lightweight repository about DOM operation which imitated jQuery

The repository about MHQ has implemented most basic functions and its detailed will be introduced then.
It also realizes Programming Chain.

## USAGE

- If have download this repository, you can use MHQ Object like jQuery object;
- You can also use M like $。 

## MAIN FUNCTION

### 1. Basic Tool Methods 

#### 1.1 Some Common Method

- each()
  + return an Object, implements traverse;
- map()
  + retuen an Array

#### 1.2 Some Tool Methods are Used to Operate DOM

- next()
  + return DOM Object, it is the next element of the current dom element
- nextAll()
  + return Array about DOM Object, they are the next all elements of the current dom element
- prev()
  + return DOM Object, it is the previous element of the current dom element
- prevAll()
  + return Array about DOM Object, they are the previous all elements of the current dom element
- deepCloneNode()
  + return new Node
- unique()
  + return MHQ Object
- contains()
  + return boolean value
- filter()
  + return MHQ Object which contains those elements which meet some condition
- trim()
  + remove the spaces

#### 1.3 Implements toArray method, get method and pushstack

- toArray()
  + used to transform array
- get()
  + used to get DOM element in one MHQ Object which composed by DOM elements
- pushstack()
  + the main using is to restore chain

### 2. The Method Is Use to Handle HTML String

- parseHTML

### 3. Methods In DOM Operation Model

- appendTo()
- prependTo()
- prepend()
- append()
- next()
- prev()
- remove()
- after()
- before()
- parent()
- children()
- find()
- filter()

### 4. Restore Chain Method

- end()

### 5. The Method In DOM Attribute Operation Model

- attr()
- prop()

### 6. Style Operation Method

- css()
- hasClass()
- addClass()
- toggleClass()
- removeClass()

### 7. Event Handle 

- on()

### 8. Event Object 

- event
- type 
- clientX
- clientY
- screenX
- screenY
- pageX 
- pageY 
- altKey 
- shiftKey
- ctrlKey 
- target
