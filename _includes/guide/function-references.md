<h1 id="function-refs" class="page-header">Function References</h1>

<p class="lead">
Pollen supports function references. The function which is the type for the
reference declaration must be a module function definition or a protocol
function declaration.
</p>

Here is the declaration of a module function reference. 

     Mod.foo() f1                 // f1 is a reference to foo() in module Mod 

Function references can also be references to protocol function declarations.
Here is the declaration of a protocol function reference. Protocol `Proto` must
contain function declarations for `bar()` and `foo()`.

     Proto.bar(uint8) f2          // f2 is a reference to a function taking a uint8 

     (uint8 Proto.foo()) f3       // f3 is a reference to a function returning a uint8 

The function reference `f3` is declared with a return type. If the function has parameters or a return type that must be represented in the function reference declaration. 

<div class="alert alert-warning" role="alert">
  <span class="glyphicon glyphicon-eye-open"></span>
     When a return type is specified in a function reference, the parenthesis around the declaration is required. 
</div>

A host function reference can be declared if its value is a target function.  

<div class="alert alert-warning" role="alert">
  <span class="glyphicon glyphicon-fire"></span>
     A function reference cannot be initialized to a host function.
</div>

<div class="alert alert-info" role="alert">
  <span class="glyphicon glyphicon-leaf"></span>
     The concept of a function reference is not supported in the host time programming environment.
</div>



Below, `Mod.foo()` is a target function value for a host function reference. If `Mod.foo()` were a host function neither a host nor target function reference could be assigned to it. 

     host Mod.foo() f4             // a host function reference to target Mod.foo() 

Calls through function references are simply the reference name followed by parentheses which may contain parameters (if there are any):

         f1()                      // call Mod.foo()
         f2(7)                     // call Proto.bar(7) 
         uint8 i = f3()            // call Proto.foo()

Note that `f1` is fully initialized to a specific module function as a result of the declaration above. It is ready to use. However `f2` is not ready to use because it is initialized to a protocol function declaration and as such it does not reference a specific module function.  Before `f2` can be used for calls it must be assigned to a module function with a signature which is compatible to the signature `bar(uint8)`.  If `Mod` contains such a function this assignment would do it: 

    f2 = Mod.bar

Function references can also be assigned to other function references and passed as parameters to functions if the signatures are compatible. If you are familiar with C, signature compatibility follows C rules.

<div class="alert alert-info" role="alert">
  <span class="glyphicon glyphicon-leaf"></span>
     Class function references are not supported.
</div>


<h4 class="page-header"
id="ref-funrefs-events">
Use Case: Function References in the Event Subsystem
</h4>

Using function references to initialize events with handlers is a powerful and
general way to support event handling. Using function references it is easy to create and initialize an event with a handler that executes the actions appropriate for that specific event. 

In the `pollen-core` cloud bundle there is a constructor that takes a handler in the `Event` class:

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
        tickEvent = new Event(h)            // tickEvent is initialized with a handler 
        TimerManager.registerTimerOnHost(@)
      }
      // ...
    }

It is the timer client who sets the appropriate handler for the timer being
initialized. This reflects the principle of separation of concerns. It is the
client who determines the action for handling the event from what is required in
the client context. That is exemplified above in passing the `Event` handler to the `Timer` constructor.


<h4 class="page-header"
id="ref-funrefs-generic">
Use Case: Function References for Generic Code
</h4>

Pollen's object oriented features are designed to be highly efficient in time and space. Pollen does not add any runtime overhead above the C runtime. But having genericity in calls can be very convenient. Here is one way to achieve generic calls in Pollen with no overhead at all. 

The example below uses an LedProtocol function reference to function `on()` as an array type. The array elements are module function references. (Each module implements the protocol LedProtocol). This array is initialized statically to the `on()` methods of a set of leds. It can be traversed in a for loop to turn all the leds on. 

    LedProtocol.on on[3] = { Led1.on, Led2.on, Led3.on }
    setOn() {
         for (int i = 0; i < 3; i++) {
             on[i]()          // turns on Led1, Led2, Led3
         }
    }
