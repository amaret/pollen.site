<h1 id="classes" class="page-header">Classes</h1>

<p class="lead">Classes in Pollen are used to implement software abstractions. A Pollen class defines an object with private data and public and private services.</p>

Classes in Pollen are used to implement software abstractions such as Timers, Events, Queues, Lists and the like.  Unlike modules, object instances defined by classes are not singletons.  Multiple instances of the same class can exist. 

A Pollen class defines an object with private data and public and private services (or functions).  Classes in Pollen support abstraction and information hiding and Pollen is an object oriented language.  But Pollen is also designed to be highly efficient and in fact to have no overhead above C. For this reason class inheritance is not supported. One implication of class inheritance is that the method invoked in a call can vary with the dynamic type of the invoking object. Dynamically binding the method invocation to the call has a runtime cost which compromises the high degree of efficency that is required in embedded applications and for this reason class inheritance is not supported in Pollen. 

Although Pollen classes do not support class inheritance they can implement protocols. (A protocol is an interface type which does not support subtyping.) 

Classes have host and target constructors, like modules. 

<div class="alert alert-success" role="alert">
  <span class="glyphicon glyphicon-leaf"></span>
  Dynamic memory management (new, free) is not supported. Look for it in the next release.
</div>


<h2 class="page-header"
id="ref-class-ref">
Class References
</h2>

Modules and classes can declare class references. There are no pointers in
Pollen. Objects are accessed through references. For a class MyClass,
here are two valid declarations of a reference to MyClass. Each form of
declaration has identical effect.

    host MyClass ref1 = new MyClass()
    host new MyClass ref2()

These class references have the attribute host. This means that the initial
values for the referenced objects will be calculated in the host phase
and the objects themselves will allocated at load time. They are not
dynamically allocated.

When dynamic memory allocation implemented it will look like the above
declarations except the host attribute will not be present.

Functions are invoked via class references in the manner common to C++ or Java:

    ref1.foo()

Pollen does not support inheritance for classes. Class types must match exactly on assignment:

    ref1 = r        // r must have MyClass type

Similarly, if a function takes a MyClass reference parameter, only a class
reference of MyClass type is a valid parameter on a call to that
function. Subtyping is not supported.This is an advantage in embedded
applications because subtyping support requires resources that are in
short supply on these systems.

<div class="alert alert-success" role="alert">
  <span class="glyphicon glyphicon-leaf"></span>
  Pollen supports references - and does not support pointers.
</div>

<h2 class="page-header"
id="ref-class-define">
Defining Classes
</h2>

The class below shows how classes are defined. A package statement is followed
by imports statements, then the class name (`Timer`) is specified, followed by the class
members (data and functions). 

This `Timer` source code is located in the cloud. It is
in the `pollen.time` package which is contained in the `pollen-core`
cloud bundle.  

<div class="alert alert-success" role="alert">
  <span class="glyphicon glyphicon-leaf"></span>
  Pollen source code in the cloud bundles can be downloaded. 
</div>

<h4 class="page-header"
id="ref-class-timer">
Timer Example
</h4>

    package pollen.time
    from pollen.event import HandlerProtocol as HP    // Timer uses event subsystem
    from pollen.event import Event
    import TimerManager
    
    class Timer {  
    
      host Event tickEvent
      bool active = false
      bool periodic = false
      uint16 duration = 0
      uint16 tickCount = 0
    
      public host Timer(HP.handler h) {   
        @tickEvent = new Event(h)                   // '@' is 'this' pointer.
        TimerManager.registerTimerOnHost(@)
      }  
    
      public start(uint16 ms, bool repeat) {
        @duration = ms
        @periodic = repeat
        @tickCount = 0    
        TimerManager.addTimer(@)    
        @active = true
      }
    
      public tick() {
        if (@active) {
          @tickCount++
          if (@tickCount == @duration) {
            @tickEvent.post()    
            if (@periodic) {
              @tickCount = 0
            } else {
              @stop()
            }
          }
        }
      }
      public stop()          { @active = false }
      public bool isActive() { return @active }
      public fire()          { @tickEvent.fire() }
    
    }

`tickEvent`, the first data member, has the attribute attribute `host`. It is
initialized in the `Timer` host constructor so that it 
will be allocated and initialized statically at load time. 

In addition the host constructor registers the new `Timer` with the `TimerManager` module: 

        TimerManager.registerTimerOnHost(@)     

Each time a timer is registered, the `TimerManager` is informed 
and it adjusts its allocation of its internal data structures accordingly. 
This reflects one of the design goals of Pollen: to enable the software to
automatically configure and initialize itself in response to changing
requirements. A user can add a timer to their application and not have to touch the
`TimerManager` code.  Note that the `TimerManager` data structures can grow or shrink
without requiring dynamic memory allocation, improving software reusability and reliablity.

There are no hardware dependencies in this code despite the fact that
timers vary across hardware platforms and this code can be used across various
platforms. Pollen has simple and elegant ways to separate hardware details from
software implementations, for example through compositions.  This makes Pollen code reusable and extensible across varying platforms. 

<h4 class="page-header"
id="ref-class-timer-using">
Timer: Using A Cloud Bundle Class
</h4>

To use the `Timer` class two things are required:

1. The Pollen translator invocation must specify the bundle. Specifically the translator  must be invoked with `-b @pollen-core`, where `-b` is the bundle option and `pollen-core` is the bundle which contains the `Timer.p` file. (Note that '@' is used for bundles which reside in the cloud with the Pollen translator.) 
2. The `Timer` class must be imported:

      <code>from pollen.time import Timer</code>

After these steps, allocating and configuring any number of
timers is very easy.  The code below is allocating and configuring three timers. 

    host Timer t1 = new Timer(tick1)
    host Timer t2 = new Timer(tick2)
    host Timer t3 = new Timer(tick3)

The parameter to the `Timer` constructor is a handler (a function reference). The handler will be called when the timer has completed a specified time interval. Each of these timers is getting a different handler.

These declarations have the attribute `host` which means that the `Timer` host
constructor will be called as a result of the `new` request. As a result,
when the application begins execution on the target hardware, the `Timer`
objects will be statically initialized.

Here is the code which starts the timers. Each timer specifies a different interval in milliseconds. 

    t1.start(250, true)
    t2.start(350, true)
    t3.start(550, true)

