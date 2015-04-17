<h1 id="control-flow" class="page-header" style="margin-top: 5px">Modules</h1>

<p class="lead"> The most fundamental type in Pollen is the module. It can be thought of
as a singleton class.  </p>

Modules implement information hiding and a separation of concerns. This
improves code quality and supports reuse.

Relative to other programming languages modules have particular importance in Pollen. This reflects the problem domain. An embedded application is inseperable from its embodiment in hardware. Leds, pins, and other components are better modeled with static singleton classes than with dynamic object instances. Note that classes are also supported in Pollen and are often used for software abstractions (such as Events or Queues) which lack concrete physical embodiment. 

A module imports the units it needs and
then defines functions and data members. All data is private except for
protocol members (which are data members whose type is a
protocol). Functions can be public. If the public attribute is not present the
function is private.

The top level unit presented to the Pollen translator must be a module. 

<h2 class="page-header"
id="ref-modctor">
Module Constructors
</h2>

Modules can define both host and target constructors. The host constructor runs
at host time and the target constructor runs after load time object allocation,
at entry to the program. Here are the host and target module constructors for
`MyModule`:

          public host MyModule()         { ... }  
          public MyModule()              { ... }  

Module constructors, both host and target, take no parameters and are only called once, by the system. They are public only. The order of execution of constructors is undetermined with one exception - the constructor of the top level module is run after all the others.

Module Examples
-----------------------

<h4 class="page-header"
id="ref-blink">
Blink Example
</h4>

The first example belows shows a simple top level module that
implements an led blink using a timer.


    import pollen.environment as Env 
    from Env import StatusLed as Led
    from pollen.time import Timer

    module Blink {
      host Timer t1 = new Timer(tick)
      
      Blink() { 
        Led.off()
      }

      public tick() {
        Led.toggle()
      }

      pollen.run() {
        t1.start(500, true)               // trigger timer every 500ms
        Env.Newsroom.run()                // start the event system
      }
    }

Blink demonstrates the main characteristics of a module:

1. It has a constructor `Blink()`. It does not have the attribute host so
this is a target module constructor, which means that it runs on the
target microcontroller after startup. Module contructors do not have
parameters. They are never explicitly called but instead are called by
the system, either on startup or during the host phase. If a module constructor is not defined, an empty default is assumed.

2.  It declares a data member, the class reference
`t1` of type `Timer`. It is private as all data is private. It is a host data
item so it will be initialized during the host phase.

2. It declares a public function, `tick()`. Note that a reference to this function is passed to
the host constructor of `Timer`. 

3. It has a `pollen.run()` function. This is required in every top level module (and there can
be only one in an application). This is the startup
function which is the entry point to the program. 

Modules do not support inheritance but they can implement protocols. 


<h4 class="page-header"
id="ref-I2C">
Integrated Circuit Bus Example 
</h4>

Here is an example module that is implementing a standard integrated circuit bus.  This bus (often called 'eye-squared-see' or `I2C`) provides good support for communication with various slow, on-board peripheral devices that are accessed intermittently, while being extremely modest in its hardware resource needs. It is a simple, low-bandwidth, short-distance bus. 

After the package statement, that identifies the package, the code begins with
import statements, then the module proper begins, with definitions of data and
functions. This code can be downloaded if you wish to see the omitted code.


    package atmel.atmega
    import ATmega328
    from ATmega328 import TwoWireInterrupt as TWInterrupt 
    import Cpu
    
    module I2C {
    
      enum Status { OK = 0,  ...  }
      enum BusSpeed { LOW = 0, ...  }
      host bool isMaster = true
      host uint8 busSpeed = BusSpeed.STANDARD  
      host uint8 prescaler = 0
      host uint8 bitrate = 0
      
      host I2C() {
        TWInterrupt.setHandlerOnHost(i2cISR)
      }
    
      I2C() { initialize() }
    
      public host setMasterMode(uint32 speed) {
        isMaster = true
    
      }
    
      public host setSlaveMode(uint32 speed) {
        isMaster = false
      }
    
      public initialize() { 
          !--- set prescale and bit rate registers ---!  
      }
    
      public uninitialize() { ... }
      public setBusSpeed(uint8 speed) { ... } 
      public clearBus() { ... }
      public releaseBus() { ... } 
      public resetBus() { ... } 
      public put(uint8 address, uint8 data) { ... }
      i2cISR() { !--- handler code ---!  }
    
    }

This version of the `I2C` module is hardcoded for the ATmega328.  It is possible
with Pollen constructs
to make this code fully generic and isolate the ATmega328 dependencies. 

<h4 class="page-header"
id="ref-import-I2C">
Integrated Circuit Bus: Imports
</h4>

In the `I2C` code contains this import:

     import ATmega328

The bundle containing `ATmega328` is `atmel`. 
Recall that the Pollen translator is called with a top level module and a set of bundles.
The bundles contain packages and in turn packages contain Pollen files.
The Pollen translator, to have access to this file, would need to be invoked with the `atmel` bundle on the command line.

The Pollen file `ATmega328.p` is a composition which brings together modules implementing cpu, interrupts, gpio pins, and timers, among others. (Information on compositions is  <a href="{{site.url}}/pollen/guide/compositions">here</a>.) The statement `import ATmega328` makes all these modules available for import by `I2C`. The following line selects the specific functionality in `ATmega328` which is needed in `I2C`: 

     from ATmega328 import TwoWireInterrupt as TWInterrupt 

This is the other import statement in `I2C`: 

     import Cpu

`Cpu` is a module in the `atmel` bundle which contains functions `reset()`, `shutdown()`, and `wait()`, among others, with implementations specific to the atmel platform. 

<h4 class="page-header"
id="ref-enum-I2C">
Integrated Circuit Bus: Enum
</h4>

The module definition of `I2C` contains two enums, `Status` and `BusSpeed`. These provide named values to sets
of constants. These enums are nested within `I2C` but an enum can also be the only type in a file. 
Here is their source.

      enum Status { OK = 0,             // Operation succeeded
                    ERROR = 1,          // Unspecified error
                    UNSUPPORTED = 2,    // Operation not supported
                    NOSLAVE = 3,        // Slave not responding
                    BUSBUSY = 4 }       // Communication ongoing on the bus
    
      enum BusSpeed { LOW = 0,          // 10kHz
                      STANDARD = 1,     // 100kHz
                      FAST = 2,         // 400kHz
                      FASTPLUS = 3 }    // 1MHz

<h4 class="page-header"
id="ref-modctor-I2C">
Integrated Circuit Bus: Module Constructor
</h4>

Module `I2C` has two constructors - one of which is declared with the `host` attribute and one without. Here is the host constructor:

     host I2C() {
         TWInterrupt.setHandlerOnHost(i2cISR)
     }

It is executed during the host phase.  It sets up the interrupt handler for `TWInterrupt` so that when a TWInterrupt occurs, the specified handler will be invoked. Note that in the call `TWInterrupt.setHandlerOnHost(i2cISR)` the passed parameter `i2cISR` is a function reference.  The function name is `i2cISR` and passing that name as a parameter has the effect of passing a reference to that function. 

Here is the target constructor:

     I2C() {
         initialize()
     }

It is called the target constructor because it is the one which is invoked as the application is starting up on target hardware. 

<h4 class="page-header"
id="ref-injc-I2C">
Integrated Circuit Bus: Injected Code
</h4>

Pollen supports directly including C code through injection. In the `I2C`
module the function `initialize()` uses injected code. Here is the `initialize()`
source:

      public initialize() {
    
        // Ensure that TWI is not in power reduction
        +{PRR &= ~(1<<PRTWI)}+
    
        // Set prescale and bit rate registers
        +{TWSR}+ = prescaler
        +{TWBR}+ = bitrate
    
      }

The code injection blocks in `initialize()` are initiated by `+{` and end with a
matching `}+`. The code between these markers is C code. In this example the
injected code consists of register definitions that come from C header files for
this target platform. Code injection blocks can be used to include C header
files, functions, declarations, statements, and even expressions in Pollen
programs. This degree of support for integration with C makes it easy to access
the benefits of Pollen in any context where C is used, which includes virtually
all embedded software development shops. It is another way in which Pollen
supports code reuse. For more details see the section on code injection, which
is found  <a href="{{site.url}}/pollen/guide/c-code">here</a>.
