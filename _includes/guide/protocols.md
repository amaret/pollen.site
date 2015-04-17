<h1 id="protocols" class="page-header">Protocols</h1>

<p class="lead">
A protocol is a Pollen type that consists of function signatures (no code or data). 
</p>


Here is the simple protocol which defines handlers: 

    package pollen.event
    
    protocol HandlerProtocol {
    
          handler()
    
    }

`HandlerProtocol` contains one function declaration, `handler()`. It is public (as
all protocol function declarations are public). 
The class `Timer` uses this protocol (as shown 
<a href="{{site.url}}/pollen/guide/classes/#ref-class-timer">here</a>).
Here are some additional characteristics of protocols:

1. Using the `implements` clause, a class, module, or composition can implement one or more protocols. This means they must provide implementations for all contained function declarations.
2. Protocols support single or multiple inheritance via the `extends` clause. Inheritance means that the inherited function declarations are added to the descendant's set of declarations. 

<div class="alert alert-success" role="alert">
  <span class="glyphicon glyphicon-leaf"></span>
     Protocols do not support subtyping. In other respects they are like interface types.
</div>

<h2 class="page-header"
id="ref-protocol-member">
Protocol Member
</h2>

Protocols can be used as the type of data member declarations. When a data member (declared within the body of a class, module, or composition) has a type which is a protocol, the data member is called a protocol member. 

      TimerMilliProtocol HwTimer     // a protocol member 

<h2 class="page-header"
id="ref-protocol-proxy">
The Proxy Pattern
</h2>

Protocols have a number of uses in Pollen. The most important in terms of supporting abstraction and code reuse is how protocols and protocol members enable the Proxy Pattern. 

Embedded applications often have a high degree of similarity in their code functionality masked by a diversity of lower level differentiation in hardware. Embedded software code tends to be tightly coupled to specific hardware. This is an obstacle to code reuse. Protocols in Pollen enable the separation of interface from implementation so that embedded applications can realize the potential of code reuse. 

We will show how the timer implementation (`Timer` source
<a href="{{site.url}}/pollen/guide/classes/#ref-class-timer">here</a>)
uses the Proxy Pattern to insulate itself from hardware dependencies. 

It is the `TimerManager` module which implements the Proxy Pattern. First
`TimerMilliProtocol` is imported and then `TimerManager` declares a protocol member `HwTimer` of that type:

    from pollen.hardware import TimerMilliProtocol
    import Timer
    
    module TimerManager {
    
      TimerMilliProtocol HwTimer     // protocol member 
    
      TimerManager() { }
      host uint8 numMsTimers = 1
      Timer msTimers[numMsTimers] = {null}
    
      host TimerManager() {  
        HwTimer.setHandlerOnHost(tickISR)
        numMsTimers = 0
      }
    
      public host registerTimerOnHost(Timer t) { numMsTimers += 1 }
    
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
      tickISR()                     { /* the tick event handler */ }
    
    }

(Some code omitted. `TimerManager` is in the cloud bundle `pollen-core` and can be downloaded.)

In `TimerManager` there is no hardware dependent code. But it is reasonable to
assume that some of these methods will have hardware dependencies in their
implementation. These include `start()`, `stop()`, and `isRunning()`. Note that these
methods call an underlying implementation through the procotol member `HwTimer`. 
The protocol member is the proxy. 

<h2 class="page-header"
id="ref-protocol-bind">
Protocol Binding
</h2>

In Pollen hardware dependent code is bound into the application when 
protocol members are bound to implementing modules. 

In the current example this happens
when the protocol member `HwTimer` is bound to an implementing module. 
The protocol `TimerMilliProtocol` 
is abstract and it can be bound to a variety of hardware implementations.
This is an important way in which Pollen supports the separation of interface from implementation.

<h4 class="page-header"
id="ref-protocol-binding-op">
Protocol Binding Operator
</h4>

Here is how `HwTimer` is bound to an implementing module:

    TimerManager.HwTimer := TimerMilliTC1       // protocol member binding

In the statement above, `TimerMilliTC1` is a module that implements the `TimerMilliProtocol` for a specific hardware timer. (In this case the platform supported is atmel.)

The operator `:=` is called the binding operator and it is only used to bind
implementing modules to protocol members. The module being bound must implement the specified protocol for the binding to be valid. 

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

<h4 class="page-header"
id="ref-protocol-static-binding">
Static Binding
</h4>

The binding of a protocol member to an implementation is static. 
After a protocol member is bound the binding cannot be changed. 

This means that the  Proxy Pattern as implemented in Pollen does not have the overhead of dynamic
binding, unlike other object oriented languages (whose applications
execute in resource rich contexts). In the embedded context the overhead of
dynamically binding a proxy to a call (or going through a virtual table to
select the method target) is not desireable. 


Static binding is suitable for the embedded context in which module implementations correspond to physical hardware. In our example the characteristics and properties of the timer used are static features of the embedded application, not subject to midstream change. 

Let us next look at a hardware dependent implementation of the timer protocol. (This code is located in the `atmel` cloud bundle.)

<h4 class="page-header"
id="ref-protocol-implements">
TimerMilliTC1: A Protocol Implementation
</h4>

    package atmel.atmega
    
    from pollen.hardware import HandlerProtocol
    from pollen.hardware import TimerMilliProtocol
    from pollen.hardware import InterruptSourceProtocol
    
    import Cpu
    
    module TimerMilliTC1 implements TimerMilliProtocol {   // implements clause
    
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
      public bool isRunning() {
        return (+{TCCR1B}+ & 0x03) > 0
      }
      public start() { /* code omitted */ }
      public stop()  { /* code omitted */ }
    
    }

Note that this module declares that it implements `TimerMilliProtocol` on its
declaration via the `implements` clause.

This is the implementation that is bound as a consequence of the module binding
statement above. Some code has been included to show an example of hardware
dependent code in Pollen.  The hardware dependent code has been encapsulated and made modular so that it is available in a general way to any client wanting to use this hardware timer. 

The use of `+{` and `}+` signifies injected C code. The names within `+{` and `}+` brackets originate in C header files that are provided for this platform. With Pollen you not only can use existing C in your application, you can use it in a structured and reusable way! 


<h4 class="page-header"
id="ref-protocol-bind-loc">
Protocol Binding Location
</h4>

Up to this point we still have not seen precisely where the binding of protocol
member to implementation happens. If you take a look back at `TimerManager` you
will see that while `HwTimer` is declared in that module, it is not initialized
there. That implies two things: 

1. If that binding does not take place in `TimerManager`, that means that `TimerManager` does not have to change when a new timer implementation is desired. 

2. Since the protocol member `HwTimer` is not assigned in the same module in which it was declared, it must be public, not private. 

Both these points are true. The protocol member binding can take place outside of the module
that declares the protocol member (usually they are bound in compositions), and protocol members are the only data members who can be public. In fact they default to public.

Use of compositions as the location of protocol binding means that Pollen code can be made generic
with hardware dependencies encapsulated. Recall that 
a composition is a configuration module. (More details <a href="{{site.url}}/pollen/guide/compositions">here</a>.)
It is used to assemble and configure a subsystem. For example, a microcontroller or MCU is a composition of modules representing hardware peripherals. Pollen is designed so that you can locate hardware dependent configurations in a composition and then it is often possible to use other modules without change. 


<h4 class="page-header"
id="ref-protocol-bind-env">
Environment Compositions and Protocol Binding 
</h4>

There is a cloud bundle called `environments`. Compositions in that bundle configure a variety of environments.  
(You can download and modify any Pollen code in the cloud and also write your own
compositions.) In this example the `Uno` composition from that bundle is used.
It is the configuration composition for the arduino platform. 

The protocol member `HwTimer` is bound in `Uno`. 
Here is some code from `Uno` that shows the binding.
We also show the binding of other protocol members and set several configuration values (frequency, baud rate). Note that composition initialization and configuration takes place during the host phase. 

    Led.pin := PB5
    Newsroom.GI := GlobalInterrupts
    TimerMilliTC1.TimerInterrupt := Timer1MatchAInterrupt
    TimerManager.HwTimer := TimerMilliTC1                   // protocol member binding
    Mcu.setFrequencyOnHost(16000000)
    Uart.setBaudOnHost(38400)

<h4 class="page-header"
id="ref-protocol-bind-cmmd">
Setting the Environment on the Command Line
</h4>

The `-e` option to the cloud compiler allows you to specify a path to an
environment composition. That means that you can change the target platform
simply by changing an option on the command line. This will be shown below with
an example.

<div class="alert alert-success" role="alert">
  <span class="glyphicon glyphicon-leaf"></span>
     With Pollen the target hardware can be changed with command line switches.
</div>

<h4 class="page-header"
id="ref-protocol-timerblink">
TimerBlink Example
</h4>

Here is a small Pollen program that uses the timer implementation and toggles an
Led when the timer ticks. This program also uses the event and led modules in
the cloud. Copy this file and paste it into a file named `TimerBlink.p` to try
running the cloud compiler.

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

The Pollen translator command line shown below will translate this file for the arduino. 

Here are descriptions of the options used:

- `-e` is the option to specify an environment. 
- `-b` is the option for bundles. In this case cloud bundles are used which is
  signified by `@` before the bundle name.
- `-t` is the option for the toolchain. 
- `--mcu` is the option for target microcontroller. 
- `-o` option specifies the path to the output file. 

The C compiler output file will have the name TimerBlink-prog.out (or <top level module name>-prog.out in the general case). Note that other tools may run on that file (e.g. objcopy) so what the final executeable name will be depends on the toolchain used. 

    pollenc                            \
        -o <output path>               \
        -t avr-gcc --mcu atmega328p    \
        -b @pollen-core                \
        -b @atmel                      \
        -b @environments               \
        -e @environments/arduino/Uno   \
        TimerBlink.p
    
The option `-h` will list the options to the cloud compiler.
