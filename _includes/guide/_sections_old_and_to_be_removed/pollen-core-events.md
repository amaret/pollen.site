
How to Declare and Use Events
===========================

The Pollen cloud bundle `pollen-core` contains definitions of timers, events, queues, lists, and more. In package `pollen.event` there are four types which support the event subsystem: `Event`, `Newsroom`, `HandlerProtocol`, and `EventQueue`. 

- `Event`.
Applications that use events will use this class. Code to create, post, and fire events is here. The event handler is initialized in the constructor and you can also call a function to set the handler after construction. 

- `Newsroom`.
The `Newsroom` class handles administration and registration of events. The event subsystem runs in a loop and it is necessary to call `Newsroom.run()` to start that loop but otherwise calls to `Newsroom` are usually not necessary in client code. 

- `HandlerProtocol`.
This protocol defines a signature for handlers used by events.

- `EventQueue`.
Used by `Newsroom`.


The timer subsystem creates events in a manner similar to the way a typical Pollen application would; it is the `Timer` class which creates and initializes an event. It is the timer clients who start the event subsystem by calling `Newsroom.run()`. We highlight this call in our `TimerBlink` example below.

    import pollen.environment as Env
    from Env import Led
    
    from pollen.time import Timer
    
    module TimerBlink {
    
      host new Timer t1(tick)    
    
      tick() {
        Led.toggle()
      }
    
      pollen.run() {
        t1.start(500, true)      
        Env.Newsroom.run()      // start the event subsystem
      }
    }

`Newsroom` provides support for a simple loop dispatcher where queued events are dispatched in FIFO order. The loop runs indefinitely. Each event handler runs to completion. This loop is initiated by the call to `run()`. This simple approach is suitable to many embedded applications which run with extremely tight memory and time constraints and cannot host even a scaled down microkernel RTOS. It is also more deterministic than dispatchers that use priority and that is important in saftey critical applications. This approach conforms to a pattern common to embedded applications and Pollen provides support for it in package `pollen.event`. Of course you can use Pollen with other approaches. 

The `Timer` class encapsulates the timer event. To show an `Event` example we extract the code in the `Timer` class which uses the event subsystem.

    from pollen.event import HandlerProtocol as HP  // import the HandlerProtocol
    from pollen.event import Event                  // import the Event class
    import TimerManager
    
    class Timer {  
    
      host Event tickEvent                          // declare an Event
      bool active = false
      bool periodic = false
      uint16 duration = 0
      uint16 tickCount = 0
      // ...
      public host Timer(HP.handler h) {   
        tickEvent = new Event(h)                    // initialize an Event with a handler
        TimerManager.registerTimerOnHost(@)
      }  
      // ...
      public fire() {
        tickEvent.fire()                            // fire the event 
      }
      // ...
      public tick() {
        if (@active) {
          @tickCount++
          if (@tickCount == @duration) {
            @tickEvent.post()                       // post the Event.
            if (@periodic) {
              @tickCount = 0
            } else {
              @stop()
            }
          }
        }
      }
      // ...
    }

The `tick()` function in `Timer` is called by the `TimerManager` (which is the controller for hardware timer interrupts). When the interval specified by the timer client has passed, a tick will result in the posting of a `tickEvent`. That means the `tickEvent` will be added to the `EventQueue` for eventual dispatch by `Newsroom`. 

To use the event subsystem a client application follows these steps:

1. Declare an `Event`.

2. Define an `Event` handler.

3. Initialize the `Event` with handler. 

4. Call `Newsroom.run()`. This call will not return. The `Newsroom` dispatch loop will run indefinitely. 

You must also post events, according to your application logic. 
