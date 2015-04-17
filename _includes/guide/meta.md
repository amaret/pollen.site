<h1 id="meta" class="page-header">Meta Types</h1>

<p class="lead"> A meta type is instantiated with <em>value</em> or <em>type</em> parameters, making a new type.  </p>

Embedded applications often have a high degree of similarity in their code functionality, to do the basic work of controlling the hardware, within a context of high variability and complexity in initial configuration of that hardware. Pollen has powerful features that support reuse of code within the context of variable and complex initial configuration.

One powerful feature that supports code reuse in Pollen is meta types. A meta type is instantiated with *value* or *type* parameters, making a new type. This is useful for configuration and initialization of gpio pins, leds, and the like. It greatly reduces the amount of code that is required and at the same time enables extensive reuse of that code. 

The meta keyword can be used with modules, protocols, compositions, and classes. When the meta keyword is present, the type is a meta type. Whenever meta types are imported, meta parameters must be supplied, and a new type, using those parameters, will be created.

<h2 class="page-header"
id="ref-meta-valueparm">
Meta Types with Value Parameters.
</h2>

Here is the definition of `LedMeta`, a meta type in the `pollen-core` cloud bundle which takes a
meta value parameter:

    meta {bool activeLow}         // activeLow is a meta value parameter
    module LedMeta {              // LedMeta is a meta type
        ....
    }

When `LedMeta` is imported into a unit, a value for the parameter must be available. Such an import is called a meta instantiation:

    import LedMeta{true} as Led   // a meta instantiation. 

Due to the `as` clause the instantiated type will be referred to in the local context as `Led`. 

An LED can be wired up to light in two ways. If active high the LED is on when signal is high and if active low the LED is on when the signal is low. The new type generated from `import LedMeta{true}` with all of its code is ready to use with the proper configuration in place.  Any declaration in the importing context that uses `Led` is using a type which has already been configured with the `activeLow` parameter. 

An instantiation of LedMeta{true} is a different type than an instantiation of LedMeta{false}. There is no type relationship between them. 

Meta value types are especially useful for GPIO pins because the number of pins
that need to be configured can be significant so the code reuse enabled by meta
types is also significant. Composition `Uno` imports and extends composition
`ATmega328` and in particular imports some of the gpio pins that `ATmega328`
configures.  Below we show a few of the meta type import statements inside `ATmega328` for gpio pins. Each import instantiates a type which is given a local name inside `ATmega328` via the `as` clause. 


    !-- General Purpose I/O Pins --!
    import PinMeta{"B", 0} as PB0       // type PB0 for pin 0 on port B 
      ...                               // imports omitted for brevity
    import PinMeta{"D", 7} as PD7
    

The code below shows the `PinMeta` implementation that is imported above. The meta parameters are `port` and `pin`. As this code is used to create modules that will control the pins it has specific hardware dependencies. Thus it includes `<avr/io.h>` and there is injected C code in most functions. 

    package atmel.atmega
    
    !--
      Implementation of a meta module for pin drivers
     --!
    
    from pollen.hardware import PinProtocol
    
    meta {string port, uint8 pin}                       // meta parameters port and pin
    module PinMeta implements PinProtocol {
    
      +{ #include <avr/io.h> }+
    
      host uint8 pinMask
    
      host PinMeta() {
        pinMask = (1 << pin)
      }

      // code for toggle(), set(), clear(), get(), isInput() omitted.
    
    }

<h2 class="page-header"
id="ref-meta-pollen-names-injected">
Using Pollen names in Injected Code
</h2>

Here is `toggle()` in `PinMeta`:

    public toggle() {
        +{ PORT`port` ^= `pinMask` }+
      }

This function consists of one line of injected C code in which names from the Pollen namespace are used: local variable `pinMask` and meta parameter `port`. The use of backticks signifies that a name from the Pollen namespace is being used in injected C code. After the following instantiation that specifies port 'B' and pin 5:

     import PinMeta{"B", 5} as PB5 

Then function `toggle()` would be instantiated as:

    public toggle() {
         PORTB ^= pinMask
    }

Note how the Pollen handles substitution with backticks - in particular, note
that the *value* of the meta parameter is substituted into the code whereas the
*name* of the Pollen local variable is substituted. 


<h2 class="page-header"
id="ref-meta-default-parms">
Default Values for Meta Parameters
</h2>

Meta parameters can have default values which are used if no parameters are
supplied. The `LedMeta` module in the bundle `pollen-core` is an example. Meta parameter `activeLow` has a default value of false:

    from pollen.hardware import PinProtocol
    
    meta {bool activeLow = false}
    
    module LedMeta {
    
      PinProtocol pin        // protocol member for the pin.

      ... // code omitted
    
    }

When the meta parameter has a default value supplying a meta parameter is optional. The above meta type `LedMeta` can be imported like this:

    import LedMeta

and it will be instantiated with the default value and the local name is `LedMeta`. 

<h2 class="page-header"
id="ref-meta-provided">
The Provided Statement for Meta Types
</h2>

The provided statement is a translation time switch that controls what code will
be generated based on the value of a meta parameter. 
The function `isOn()` in `LedMeta` uses the provided statement:

      public bool isOn() {
        provided(activeLow == true) { 
          return pin.get() == false
        } else {
          return pin.get() == true
        }
      }

If `activeLow` is true the function returns `pin.get() == false` and vice versa. In the default case (when `activeLow` is false) the function would be generated as:

      public bool isOn() {
        return (pin.get() == true)
      }

<h2 class="page-header"
id="ref-meta-typeparm"> 
Meta Types with Type Parameters
</h2>

Instantiating meta types with type parameters is useful for types which support
software abstractions such as Queues, Lists, and the like. The type of the Queue
element can be specifed with a meta type parameter. Meta type parameters are
indicated with the keyword `type`:

    meta {type E, type T = uint8}
    
    class Queue {
         ...       
    }

The `Queue` type is in the `pollen-core` cloud bundle. Below we show the code with function bodies empty for brevity. (This code can be downloaded.) The host constructor is shown to illustrate how the size of the array can be increased from the default at host time and the array will have constant size and be allocated statically at load time. 

Note that in the code of the meta type the name of the type parameter can be used as a type. For example, `length` has type `T` and elements has type `E`. When the types are instantiated these type names will be replaced with the type parameter names. The types used to instantiate meta types can be primitive types or classes (but not modules or protocols).

    !--
      First-in-first-out (FIFO) data structure implemented as an array of fixed length.
    --!
    
    meta {type E, type T = uint8}
    
    class Queue {
    
      const uint8 capacity = 10
      host E elements [capacity]
      T length
      T head
      T tail
      T maxLength
    
      public host Queue(T max) {
        @length = 0
        @head = 0
        @tail = 0
        @maxLength = max
    
        if (max > @capacity) {
          @capacity = max
        }
      }
    
      // Default target constructor
      Queue() {}
      public host setCapacity(T capacity) { ... } 
      public bool add(E e) { ... }
      public E remove() { ...  }
    }

The `Dispatcher` code below shows how this `Queue` could be used. In this use case, the `Queue` is being instantiated with `Event`. If the `Queue` is empty the `Dispatcher` will run indefinitely, until an event arrives. 

    !---
    Event Dispatcher
    ---!

    import Event {uint8} as Ev
    import Queue {Ev, uint8} as EvQueue    // the Queue will be instantiated with type Ev and type uint8
    
    module Dispatcher {
    
        host new EvQueue myEventQueue(10)
        host public Dispatcher() {
        }
    
        public post(Ev e) {
            myEventQueue.add(e)
        }
    
        public run() {
    
            while(true) {
                Ev e = myEventQueue.remove()   // remove an event from the queue
                if (e != null) {
                    e.handle(e.getData())      // handle event
                    break;
                }
            }
        }
    }


<h2 class="page-header"
id="ref-meta-import">
The Import Statement for Meta Type Instantiation
</h2>

A meta type instantiation creates a new type. The parameters that instantiate the meta type are passed on the import statement. 

Here is `LedMeta`, a meta type in the `pollen-core` cloud bundle:

    meta {bool activeLow}         // activeLow is a meta parameter

    module LedMeta {              // LedMeta is a meta type
        ....
    }

When `LedMeta` is imported into a unit, a value for the parameter must be available. Such an import is called a meta instantiation:

    import LedMeta{true} as Led   // a meta instantiation.

