<h1 id="classes" class="page-header" style="margin-top: 5px">Classes/h1>

TODOs:
---------
Missing sections:  

*  How to define classes without host initialization. 
*  How new and delete / free work etc


How to Define and Use Classes
=============================

Classes in Pollen are used to implement software abstractions such as Timers, Events, Queues, Lists and the like.  Unlike modules, object instances defined by classes are not singletons.  Multiple instances of the same class can exist. 

A Pollen class defines an object with private data and public and private services (or functions).  Classes in Pollen support abstraction and information hiding and Pollen is an object oriented language.  But Pollen is also designed to be highly efficient and in fact to have no overhead above C. For this reason class inheritance is not supported. One implication of class inheritance is that the method invoked in a call can vary with the dynamic type of the invoking object. Dynamically binding the method invocation to the call has a runtime cost which compromises the high degree of efficency that is required in embedded applications and for this reason class inheritance is not supported in Pollen. 

Although Pollen classes do not support class inheritance they can implement protocols. (A protocol is an interface type which does not support subtyping.) 

Classes have host and target constructors, like modules. 

(Note that this section will build on the material in the section on modules so that section should be read first.)

Using Classes
-------------

The example we will use in this section is a `Timer`. It is located in the cloud along with the Pollen translator. (All the Pollen bundles in the cloud can be downloaded for you to inspect and modify.)

Recall that Pollen uses a two directory structure in which bundles contain packages and packages contain Pollen files.  The `Timer` class resides in the `pollen.time` package which in turn is contained in the `pollen-core` bundle. 

To use the `Timer` class two things are required:

1. The Pollen translator invocation must specify the bundle. Specifically the translator  must be invoked with `-b @pollen-core`, where `-b` is the bundle option and `pollen-core` is the bundle which contains the `Timer.p` file. (Note that '@' is used for bundles which reside in the cloud with the Pollen translator.) 
2. The `Timer` class must be imported:

    from pollen.time import Timer  


After these steps a Pollen application can allocate and configure any number of timers.  The code below is allocating and configuring three timers. The parameter to the host constructor for `Timer` is a function reference to a handler. The handler will be called when the timer has completed a specified time interval. Each of these timers is getting a different handler:

    host Timer t1 = new Timer(tick1)
    host Timer t2 = new Timer(tick2)
    host Timer t3 = new Timer(tick3)

Note that this is a host Timer which means that the Timer host constructor will be called.  Using host constructors we have off loaded initialization and configuration from the application running on the target hardware to the resource rich host, where the translator is executing. When the application begins execution on the target hardware, the `Timer` (and the `Event` object it contains) are statically initialized. Dynamic memory allocation, configuration, and initialization are avoided. This is more efficient, which is important for embedded applications. 

Also the elimination of dynamic memory allocation creates more robust systems, particularly because many embedded applications are expected to run indefinitely. Even a tiny memory leak can cause very serious problems in the embedded context so avoiding dynamic memory allocation altogether is very beneficial. But there are additional issues. Because the state of the heap can vary, using malloc() makes your program non-deterministic.  Many embedded applications are mission critical, where application failure means a risk of loss of life. For such mission critical applications, deterministic program behavior is always preferred and often required. Host initialization addresses all these issues, as it allows you to avoid dynamic memory allocation in a way that is intuitive and straight forward. 

Here is the code which starts the Timers. Each timer specifies a different interval in milliseconds. 

    t1.start(250, true)
    t2.start(350, true)
    t3.start(550, true)

How To Define Classes
-----------

Below you will find the class definition for `Timer`. After the package statement, identifying the package `pollen.time`, the code begins with import statements. The event subsystem and the `TimerManager` implement the event handling requirements for timers and they must be imported. (See the section `How To Use Events` for more details on the event subsystem.)

    package pollen.time
    from pollen.event import HandlerProtocol as HP
    from pollen.event import Event
    import TimerManager
    
    class Timer {  
    
      host Event tickEvent
      bool active = false
      bool periodic = false
      uint16 duration = 0
      uint16 tickCount = 0
    
      public host Timer(HP.handler h) {   
        @tickEvent = new Event(h)                   // '@' is syntax for the 'this' pointer.
        TimerManager.registerTimerOnHost(@)
      }  
    
      public start(uint16 ms, bool repeat) {
        @duration = ms
        @periodic = repeat
        @tickCount = 0    
        TimerManager.addTimer(@)    
        @active = true
      }
    
      public stop() {      
        @active = false
      }
    
      public bool isActive() {
        return @active
      }
    
      public fire() {
        @tickEvent.fire()
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
    }

The `Timer` class begins with the declaration of its data members. `tickEvent`, the first data member, is an `Event` with the attribute `host`. It is initialized during the host phase in the `Timer` host constructor, as seen below. It will therefore be allocated and initialized statically when the application starts up on target hardware.

In addition the host constructor registers the new `Timer` with the `TimerManager` module: 

      public host Timer(HP.handler h) {   
        @tickEvent = new Event(h)               // initialize tickEvent with the Event handler
        TimerManager.registerTimerOnHost(@)     // Notify the TimerManager of this Timer. '@' is for 'this' pointer.
      }  

This registration results in the `TimerManager` module incrementing the size of its internal array of timers to make room for the new one. This registration happens at host time, which means the size of that array of timers is computed during the host phase and thereafter is constant. Thus it can be allocated statically when the application begins executing on target hardware.  This reflects one of the design goals of Pollen: to enable the software to automatically configure and initialize itself in response to changing requirements. A user can add a timer to their code and not have to touch the `TimerManager`, as it is automatically notified by the host constructor of the new timer. Internal data structures (in this case an array of timers in the `TimerManager` can grow or shrink without touching data structure code and without requiring dynamic memory allocation. This improves software reusability and reliablity.

After the host constructor, the `Timer` class declares its services: `start()`, `fire()`, `stop()`, and so on. 

Note that there are no hardware dependencies in this code despite the fact that timers vary across hardware platforms and this code can be used across various platforms. Pollen has simple and elegant ways to separate hardware details from software implementations, as we will show in later sections. This makes Pollen code reusable and extensible across varying platforms. 
