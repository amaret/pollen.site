
How to Define and Use Meta Types
================================

Embedded applications often have a high degree of similarity in their code functionality, to do the basic work of controlling the hardware, within a context of high variability and complexity in initial configuration of that hardware. Pollen has powerful features that support reuse of code within the context of variable and complex initial configuration.

One powerful feature that supports code reuse in Pollen is meta types. A meta type is instantiated with value or type parameters, making a new type. This is especially useful for configuration and initialization of gpio pins, leds, and the like. It greatly reduces the amount of code that is required and at the same time enables extensive reuse of that code. 

Meta types are a more advanced feature of Pollen and this section should be read after you are familiar with other Pollen types.

The meta keyword can be used with modules, protocols, compositions, and classes. When the meta keyword is present, the type is a meta type. Whenever meta types are imported, meta parameters must be supplied, and a new type, using those parameters, will be created.

Here is `LedMeta`, a meta type in the `pollen-core` cloud bundle:

    meta {bool activeLow}         // activeLow is a meta parameter
    module LedMeta {              // LedMeta is a meta type
        ....
    }

When `LedMeta` is imported into a unit, a value for the parameter must be available. Such an import is called a meta instantiation:

    import LedMeta{true} as Led   // a meta instantiation. 

The result of the `as` clause above will be that the instantiated type will be referred to in the local context as `Led`. 

An LED can be wired up to light in two ways. If active high the LED is on when signal is high and if active low the LED is on when the signal is low. The new type generated from `import LedMeta{true}` with all of its code is ready to use with the proper configuration in place.  Any declaration in the importing context that uses `Led` is using a type which has already been configured with the `activeLow` parameter. 

An instantiation of LedMeta{true} is a different type than an instantiation of LedMeta{false}. There is no type relationship between them. 

Meta types are especially useful for GPIO pins because the number of pins that need to be configured can be significant so the code reuse enabled by meta types is also significant. We have previously used composition `Uno` as an example. `Uno` imports and extends composition `ATmega328` and in particular imports some of the gpio pins that `ATmega328` configures.  Below we show just the meta type import statements inside `ATmega328` for gpio pins. Each import instantiates a type which is given a local name inside `ATmega328` via the `as` clause. 


    !-- General Purpose I/O Pins --!
    import PinMeta{"B", 0} as PB0       // type PB0 for pin 0 on port B 
    import PinMeta{"B", 1} as PB1
    import PinMeta{"B", 2} as PB2
    import PinMeta{"B", 3} as PB3
    import PinMeta{"B", 4} as PB4
    import PinMeta{"B", 5} as PB5
    
    import PinMeta{"D", 0} as PD0
    import PinMeta{"D", 1} as PD1       // type PD1 for pin 1 on port D
    import PinMeta{"D", 2} as PD2
    import PinMeta{"D", 3} as PD3
    import PinMeta{"D", 4} as PD4
    import PinMeta{"D", 5} as PD5
    import PinMeta{"D", 6} as PD6
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
    
      public set() {
        +{ PORT`port` |= `pinMask` }+
      }
    
      public clear() {
        +{ PORT`port` &= ~`pinMask` }+
      }
    
      public toggle() {
        +{ PORT`port` ^= `pinMask` }+
      }
    
      public bool get() {
        return +{ (PORT`port` & `pinMask`) }+ ? true : false
      }
    
      public bool isInput() {
        return +{ DDR`port` & `pinMask` }+ ? false : true
      }
    
      public bool isOutput() {
        return +{ DDR`port` & `pinMask` }+ ? true : false
      }
    
      public makeInput() {
        +{ DDR`port` &= ~`pinMask` }+
      }
    
      public makeOutput() {
        +{ DDR`port` |= `pinMask` }+
      }
    }

Using Pollen names in Injected Code

Let's take a closer look at `toggle()`:

    public toggle() {
        +{ PORT`port` ^= `pinMask` }+
      }

This function consists of one line of injected C code in which names from the Pollen namespace are used: local variable `pinMask` and meta parameter `port`. The use of backticks signifies that a name from the Pollen namespace is being used in injected C code. After the following instantiation that specifies port 'B' and pin 5:

     import PinMeta{"B", 5} as PB5 

Then function `toggle()` would be instantiated as:

    public toggle() {
         PORTB ^= pinMask
    }

Note how the Pollen handles substitution with backticks - in particular, note that the VALUE of the meta parameter is substituted into the code whereas the NAME of the Pollen local variable is substituted. 

Default Values for Meta Parameters
--------------

Meta parameters can have default values which are used if no parameters are supplied. If you download `LedMeta` from cloud bundle `pollen-core` you will see an example. Meta parameter `activeLow` has a default value of false:

    from pollen.hardware import PinProtocol
    
    meta {bool activeLow = false}
    
    module LedMeta {
    
      PinProtocol pin        // protocol member for the pin.
    
      public LedMeta() {
        off()
        pin.makeOutput()
      }
    
      public on() {
        provided (activeLow == true) {
          pin.clear()
        } else {
          pin.set()
        }
      }
    
      public off() {
        provided (activeLow == true) {
          pin.set()
        } else {
          pin.clear()
        }
      }
    
      public toggle() {
        if (isOn()) {
          off()
        } else {
          on()
        }
      }
    
      public bool isOn() {
        provided(activeLow == true) {
          return pin.get() == false
        } else {
          return pin.get() == true
        }
      }
    }

When the meta parameter has a default value passing a meta parameter is optional. The above meta type `LedMeta` can be imported like this:

    import LedMeta

and it will be instantiated with the default value and the local name is `LedMeta`. 

The Provided Statement for Meta Types
----------------

The provided statement is a translation time switch that controls what code will be generated based on the value of a meta parameter. This statement is heavily used in the `LedMeta` meta type above. The function `isOn()` shows how this is used. If `activeLow` is true the function returns ` pin.get() == false ` and vice versa. In the default case (when `activeLow` is false) the function would be generated as:

      public bool isOn() {
        return pin.get() == true
      }

Meta Types with Type Parameters. 
----------------

Our examples so far have shown meta types being instantiated with value parameters. This is very useful for initialization and configuration of hardware components. Instantiating meta types with type parameters is useful for types which support software abstractions such as Queues, Lists, and the like. The type of the Queue element can be specifed with a meta type parameter. 

In the `pollen-core` cloud bundle there is a `Queue` type which is instantiated with two types. Below we show the code with function bodies empty for brevity. (This code can be downloaded.) The host constructor is shown to illustrate how the size of the array can be increased from the default at host time and the array will have constant size and be allocated statically at load time. 

Note that in the source code of the meta type the name of the type parameter can be used as a type. For example, `length` has type `T` and elements has type `E`. When the types are instantiated these type names will be replaced with the type parameter names. The types used to instantiate meta types can be primitive types or classes (but not modules or protocols).

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

    ----
    
    Event Dispatcher
    
    ----
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
