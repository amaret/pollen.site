
How To Define And Use Protocols and Protocol Members (The Proxy Pattern)
========================================================================


A protocol is a Pollen type that consists of function signatures (no code or data). Here is a simple protocol: 

    package pollen.event
    
    protocol HandlerProtocol {
    
          handler()
    
    }

This is the protocol which the class `Timer` imports (see the section on using classes). It contains one function declaration, handler(). It is public (as all protocol function declarations are public). Here are some important characteristics of protocols:

1. Using the `implements` clause, a class, module, or composition can implement one or more protocols. This means they must provide implementations for all contained function declarations.
2. Protocols support single or multiple inheritance via the `extends` clause. Inheritance means that the inherited function declarations are added to the descendant's set of declarations. 
3. Protocols do not support subtyping. In other respects they are like interface types.

Protocols can be used as the type of data member declarations. When a data member (declared within the body of a class, module, or composition) has a type which is a protocol, the data member is called a protocol member. 

Protocols have a number of uses in Pollen. The most important in terms of supporting abstraction and code reuse is how protocols and protocol members enable the Proxy Pattern. Embedded applications often have a high degree of similarity in their code functionality masked by a diversity of lower level differentiation in hardware. Embedded software code tends to be tightly coupled to specific hardware. This is an obstacle to code reuse. Protocols in Pollen enable the separation of interface from implementation so that embedded applications can realize the potential of code reuse. 

We used the class `Timer` from the `pollen-core` cloud bundle as an example in the section on using classes. In this section we will investigate how it is that the `Timer` class has no hardware dependencies at all.  To use timers, all a client has to do is import the `Timer` class and declare some timers of that type. The class illustrates modular and completely reusable Pollen code.  To see the value of protocols and protocol members we will explore the timer implementation further. We will to show how protocols and protocol members support a Proxy Pattern which decouples the software abstraction of a timer from the underlying hardware and thus allows the abstract timer to be used with a variety of hardware with minimal code change. 

In the presentation of the `Timer` class we saw how a `Timer` registers itself (in its host constructor) with the `TimerManager` module. This registration is internal to `Timer`. Clients do not need to know about the `TimerManager` at all. 

It is in the `TimerManager` that a protocol for timers is used. As shown below, `TimerMilliProtocol` is imported and the first data member declared in `TimerManager` is a protocol member `HwTimer` of that type:

    from pollen.hardware import TimerMilliProtocol
    import Timer
    
    module TimerManager {
    
      TimerMilliProtocol HwTimer     // protocol member for hardware timer driver
    
      host uint8 numMsTimers = 1
      Timer msTimers[numMsTimers] = {null}
      
      TimerManager() { }
    
      host TimerManager() {  
        HwTimer.setHandlerOnHost(tickISR)
        numMsTimers = 0
      }
    
      public host registerTimerOnHost(Timer t) {
        numMsTimers += 1
      }
    
      public start() {
        if (!HwTimer.isRunning()) {
          HwTimer.start()
        }
      }
    
      public stop() {
        if (HwTimer.isRunning()) {
          HwTimer.stop()
        }
      }
    
      public bool isActive()        { /* ... */ }
      public bool addTimer(Timer t) { /* ... */ }
    
      /////////////////////////////////////////////////////////
      // Private methods
      /////////////////////////////////////////////////////////
    
      tickISR()          { /* the tick event handler */ }
    
    }


(The code bodies for some functions are not shown for the sake of brevity. The `TimerManager` is in the cloud bundle `pollen-core` and you can download to inspect all the code.) 

In `TimerManager` we still do not see any hardware dependent code. It is implied but not visible in the protocol member `HwTimer`.  The protocol member `HwTimer` is the reference used in the invocation of methods whose implementation is hardware dependent - in the code above, for example, we can find `HwTimer.start()`, `HwTimer.stop()`, and `HwTimer.isRunning()`.

The hardware dependent code is bound into our application when the protocol member `HwTimer` is bound to an implementing module. Another way to think of this is that the protocol `TimerMilliProtocol` is abstract and it can be bound to a variety of hardware implementations through the binding of a member whose type is this protocol. This is an important way in which Pollen supports the separation of interface from implementation.

Here is how `HwTimer` is bound to an implementing module:

    TimerManager.HwTimer := TimerMilliTC1       // protocol member binding

In the statement above, `TimerMilliTC1` is a module that implements the `TimerMilliProtocol` for a specific hardware timer. (In this case the platform supported is atmel.)

The operator `:=` is called the module binding operator and it is only used to bind implementing modules to protocol members. The module must implement the specified protocol for the binding to be valid. 

Here is source for the protocol `TimerMilliProtocol`. It is in the `pollen-core` cloud bundle. This protocol can be implemented by any number of modules which will vary depending on the specific of the hardware timer being supported:

    package pollen.hardware
    
    import HandlerProtocol
    
    protocol TimerMilliProtocol {
    
      host setHandlerOnHost(HandlerProtocol.handler h)
    
      setHandler(HandlerProtocol.handler h)
    
      start()
    
      stop()
    
      bool isRunning()
    
    }

Binding this protocol to a timer implementation allows the application to access the hardware dependent code through the protocol member `HwTimer`. The protocol member is the proxy. Accessing the hardware dependent code through a proxy makes `Timer` and `TimerManager` reusable and generic. 

The Proxy Pattern as implemented in Pollen does not have the overhead of dynamic binding. This is unlike other object oriented languages whose applications execute in resource rich contexts. In the embedded context the overhead of dynamically binding a proxy to a call (or going through a virtual table to select the method target) is not desireable. For that reason the binding of a protocol member to an implementation is static. After a protocol member is bound the binding cannot be changed. This is suitable for the embedded context in which module implementations correspond to physical hardware. In our example the characteristics and properties of the timer used are static features of the embedded application, not subject to midstream change. 

Let us next look at a hardware dependent implementation of the timer protocol. (This code is located in the `atmel` cloud bundle.)


    package atmel.atmega
    
    from pollen.hardware import HandlerProtocol
    from pollen.hardware import TimerMilliProtocol
    from pollen.hardware import InterruptSourceProtocol
    
    import Cpu
    
    module TimerMilliTC1 implements TimerMilliProtocol {
    
      InterruptSourceProtocol TimerInterrupt
      host uint16 ticksPerMs = 0
      HandlerProtocol.handler() clientHandler
    
      host TimerMilliTC1() {
        // Set a millisecond frequency depending on the Cpu frequency
        ticksPerMs = Cpu.getFrequencyOnHost() / (1000)
      }
    
      TimerMilliTC1() {
        TimerInterrupt.setHandler(clientHandler)
        TimerInterrupt.clear()
        +{TCCR1B}+ = (1 << +{WGM12}+)      // stop the counter, select CTC mode
      }
    
      public host setHandlerOnHost(HandlerProtocol.handler h) {    
        clientHandler = h
      }
    
      public setHandler(HandlerProtocol.handler h) {
        clientHandler = h
        TimerInterrupt.setHandler(clientHandler)
      }
    
      public start() {
        // set ticksPerMs, High byte must be written before low byte
        +{OCR1AH}+ = (ticksPerMs >> 8)
        +{OCR1AL}+ = ticksPerMs
    
        TimerInterrupt.enable()  
    
        // reset the counter value, start the counter with no prescaler
        +{TCNT1}+ = 0                     
        +{TCCR1B}+ |= (1 << +{CS10}+)
      }
      
      public stop() {
        +{TCCR1B}+ &= ~(1 << +{CS10}+)
        TimerInterrupt.clear()
        TimerInterrupt.disable()
      }
      
      public bool isRunning() {
        return (+{TCCR1B}+ & 0x03) > 0
      }
    
    }

This is the implementation that is bound as a consequence of the module binding statement above. It implements setting up the tick handler and stopping and starting the timer, among other things. Here you can see the low level code operating the timer. It has been encapsulated and made modular so that it is available in a general way to any client wanting to use this hardware timer. Note the use of `+{` and `}+`, which signifies injected C code. The names within `+{` and `}+` brackets originate in C header files that are provided for this platform. With Pollen you not only can use existing C in your application, you can use it in a structured and reusable way! 

Up to this point we still have not seen precisely where the binding of protocol member to implementation happens. If you take a look back at `TimerManager` you will see that while `HwTimer` is declared in that module, it is not initialized there. That seems to imply two things: 

1. If that binding does not take place in `TimerManager`, that means that `TimerManager` does not have to change when a new timer implementation is desired. 

2. Since the protocol member `HwTimer` is not assigned in the same module in which it was declared, it must be public, not private, despite the fact that you've been told that all data members of classes and protocols are private.

In fact both these points are true. 

In Pollen the timer implementation is an example of how it is possible to implement elegant and reusable software abstractions whose code does not need to change when the underlying hardware changes. This is enabled by Pollen support for modularity, separation of concerns, and the Proxy Pattern (all of which are also used with the I2C and Uart implementations, among others). 

Also, protocol members are the only data members who can be public. In fact they default to public.

The answer to the question, where are protocol members bound to protocols, is that this binding can occur in any module but most often occurs in compositions. 

A composition is a configuration module. It is used to assemble and configure a subsystem. For example, a microcontroller or MCU is a composition of modules representing hardware peripherals. Pollen is designed so that you can locate hardware dependent configurations in a composition and then it is often possible to use other modules without change. 

In our example the binding of the protocol member `HwTimer` happens in the composition module `Uno`. Here is some code from that module that shows the binding:

    Led.pin := PB5
    Newsroom.GI := GlobalInterrupts
    TimerMilliTC1.TimerInterrupt := Timer1MatchAInterrupt
    TimerManager.HwTimer := TimerMilliTC1                   // protocol member binding
    Mcu.setFrequencyOnHost(16000000)
    Uart.setBaudOnHost(38400)

In the code above we have bound a number of protocol members and set several configuration values (frequency, baud rate). Note that composition initialization and configuration takes place during the host phase. 

Composition module `Uno` is located in cloud bundle `environments`. Compositions in that bundle configure a variety of environments.  Specifically the `Uno` composition 
is the configuration composition for the arduino platform. (We will explore it in more detail in the section on compositions.)

There is an option to the cloud compiler that allows you to specify a path to an environment composition. That means that you can change the target platform simply by changing an option on the command line. (For more information on the cloud compiler and its options see the section on getting started. There is also a section with more detail on the setting the environment composition from the command line.)

Here is a small Pollen program you can translate with the cloud compiler. It uses the timer implementation and toggles an Led when the timer ticks. This program also uses the event and led modules in the cloud. 

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
        Env.Newsroom.run()
      }
    }
The Pollen translator command line shown below will translate this file for the arduino. Note that `-e` is the option to specify an environment. Other options include `-b` for bundle (in this case cloud bundles are used which is signified by `@` before the bundle name) and `-t` for the toolchain and --mcu for target microcontroller. The `-o` option specifies the path to the output file. 

The C compiler output file will have the name TimerBlink-prog.out (or <top level module name>-prog.out in the general case). Note that other tools may run on that file (e.g. objcopy) so what the final executeable name will be depends on the toolchain used. 

For more details on the cloud compiler options see the Getting Started section. 

    pollenc.py 		                        \
        -o <output path>		            \
        -t avr-gcc --mcu atmega328p 		\
        -b @pollen-core 		            \
        -b @atmel 		                    \
        -b @environments 		            \
        -e @environments/arduino/Uno 		\
        TimerBlink.p
    
