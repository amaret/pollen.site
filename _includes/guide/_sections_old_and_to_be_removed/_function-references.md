
How to Define and Use Function References
=========================================

Pollen supports function references for module functions.

     Mod.foo() f         // f is a reference to foo() in module Mod 

Function references can also be references to protocol function declarations. (Function references to class functions are not supported at this time.) They can be declared with parameter and return types. Here is the declaration of a protocol function reference. 

     (uint8 Proto.bar(uint8)) f2  // f2 is a reference taking a uint8 parameter and returning a uint8 

The function reference `f2` is declared with a parameter and return type. Note the parenthesis surround the declaration. These are required when a return type is specified. 

A host function reference can be declared if its value is a target function.  Host functions are not allowed as values for any function references.  (The concept of a function reference is not supported in the host time scripting environment).  Below, `Mod.fcn()` is a target function value for a host function reference. If `Mod.fcn()` were a host function neither a host nor target function reference could be assigned to it. 

     host Mod.fcn() f1   // f1 is a host function reference to target function Mod.fcn() 

Calls through function references are simply the reference name followed by parentheses which may contain parameters (if there are any):

f()                          // call foo()
uint8 i = f2(7)              // call bar(7) 

Note that `f` is fully initialized to a specific module function as a result of the declaration above. It is ready to use. However `f2` is not ready to use because it is initialized to a protocol function declaration and as such it does not reference a specific module function.  Before `f2` can be used for calls it must be assigned to a module function with a signature which is compatible to the signature `bar(uint8)`.  If `Mod` contains such a function this assignment would do it: 

    f2 = Mod.bar

Function references can also be assigned to other function references if the signatures are compatible. (Signature compatibility follows C rules.) Function references can be passed as parameters. 

Function References in the Event Subsystem
---------------------

There are two especially useful cases for function references. The first is in the event subsystem. It is desireable to create and initialize an event with a handler that executes the actions appropriate for that specific event. In the `pollen-core` cloud bundle there is a constructor that takes a handler in the `Event` class:

    import HandlerProtocol as HP
    
    class Event {
    
      HP.handler() eventHandler = null    # function reference declaration
    
      public host Event(HP.handler h) {   # function reference parameter
        @eventHandler = h                 # function reference assignment
        Newsroom.registerEventOnHost()
      }
      ...
    }

The protocol definition used in the event subsystem contains the handler declaration:

    package pollen.event
    
    protocol HandlerProtocol {
    
      handler()
    }

The `Timer` class in the `pollen-core` cloud bundle creates and initializes an `Event` with a handler. That code is excerpted below.

    class Timer {
    
      host Event tickEvent
    
      public host Timer(HP.handler h) {
        tickEvent = new Event(h)            // tickEvent is initialized with a handler passed to Timer constructor
        TimerManager.registerTimerOnHost(@)
      }
      // ...
    }

It is the timer client who sets the appropriate handler for the timer being initialized. This reflects the principle of separation of concerns. It is the client who determines the action for handling the event from what is required in the client context. That is seen above in passing the `Event` handler to the `Timer` constructor.

Using Function References for Generic Calls
--------------

Pollen's object oriented features are designed to be highly efficient in time and space. The goal is no overhead above C. But having genericity in calls can be very convenient. Here is one way to achieve generic calls in Pollen with no overhead at all. 

The example below uses an LedProtocol function reference to function `on()` as an array type. The array elements are module function references. (Each module implements the protocol LedProtocol). This array is initialized statically to the `on()` methods of a set of leds. It can be traversed in a for loop to turn all the leds on. 

    LedProtocol.on on[3] = { Led1.on, Led2.on, Led3.on }
    setOn() {
         for (int i = 0; i < 3; i++) {
             on[i]()          // turns on Led1, Led2, Led3
         }
    }
