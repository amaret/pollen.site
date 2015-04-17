<h1 id="control-flow" class="page-header" style="margin-top: 5px">Compositions</h1>

<p class="lead"> 
A composition is a configuration module. 
</p>

A composition is used to assemble and configure
a set of modules that implement a subsystem. It imports modules and creates an interface of available functionality through its exports. 

         import Cpu
         import GlobalInterrupts
         import PinMeta{"B", 0} as PB0
         import TimerMilliTC1
         import Uart0 as Uart

         composition MyBoard {
            
             host MyBoard() { ... }

             export Cpu
             export GlobalInterrupts
             export TimerMilliTC1
             export Uart
             export PB0
         }


For a target platform a composition could include configuration for interrupts,
uart, GPIO, and lifecycle functions specific to that platform. An application
running on that platform will import the composition to do the configuration.
This has the effect of separating the configuration from the  application code,
making it easier to retarget the application. 

The cloud bundles have a bundle for atmel which you can inspect. Compositions for ATmega168,
ATmega328, and ATmega88 can be found there. 

Compositions are a type of module that is host phase only. They can declare host
functions and host constructors but they cannot declare target functions. They have no code that executes in the target application. Compositions assemble, configure, and initialize sets of modules so their purpose is host phase only.

<h4 class="page-header"
id="ref-compos-flex-interf">
Use Case: Building A Flexible Single Interface From Multiple Modules
</h4>

In the module section we showed `I2C`, a module which implements a
standard integrated circuit bus; this module imports the composition for the
Atmega328p. That composition assembles and configures all the constituents of
the ATmega328p hardware target. However the `I2C` doesn't need all of that. 
It only needs the `TwoWireInterrupt`. This import statement shows how to import
only what is needed from a composition: 

    from ATmega328 import TwoWireInterrupt as TWInterrupt

This selective import is available for `ATmega328` because that composition
contains this export statement:

    export TwoWireInterrupt

Compositions support building flexible interfaces from a set of
independent modules. The composition interface is defined by its set of exports. 
The application need import only what it needs from that set.
The module that implements the functionlity (here `TwoWireInterrupt`) 
is encapsulated and independent of its
client.  This makes portability for multiple hardware targets
easier. Compositions can be used to flexibly combine or subset the functionality of a set
of modules as required by the application and the target hardware.


<h4 class="page-header"
id="ref-compos-init">
Use Case: Initialization And Configuration Of A Module Outside The Module
</h4>

In the protocol section we showed the use of a hardware timer configured for the Arduino. 
The timer was initialized (in the composition `Uno`) in this statement:

       TimerManager.HwTimer := TimerMilliTC1                   // hardware timer initialization

`TimerManager.HwTimer` is being configured and initialized outside of its
module `TimerManager`. This enables the `TimerManager` module to be adapted to requirements of multiple hardware 
targets without changing any `TimerManager` code. The ability to initialize and configure modules from outside 
supports code reuse and portability. 


Compositions use imports to construct the composition functionality, exports to define the public interface, and host code (any combination of the preset initializer, host constructor, and host functions) to initialize constituent modules.
Below is the `Uno` composition showing these elements in a real life example.


    !--
      Composition that defines an environment for the Arduino Uno
     --!
    
    from atmel.atmega import ATmega328 as Mcu
    from Mcu import GlobalInterrupts
    from Mcu import TimerMilliTC1
    from Mcu import Timer1MatchAInterrupt
    from Mcu import PB5
    from Mcu import PB4
    from Mcu import PB3
    
    from pollen.event import Newsroom
    from pollen.time import TimerManager
    from pollen.parts import LedMeta as Led
    
    composition Uno {
    
      preset Uno() {
        Led.pin := PB5
        Newsroom.GI := GlobalInterrupts
        TimerMilliTC1.TimerInterrupt := Timer1MatchAInterrupt
        TimerManager.HwTimer := TimerMilliTC1
        Mcu.setFrequencyOnHost(16000000)
        Uart.setBaudOnHost(38400)
      }
    
      export Mcu
      export GlobalInterrupts
      export Led
      export PB4
      export PB3
    
    }

Note that this composition imports the `ATmega328` composition, but selects just what it needs: a timer, a timer interrupt, and 3 gpio pins (`PB3`, `PB4`, `PB5`). It also imports the event and timer abstractions and an Led. The `ATmega328` modules that are not imported are not included in the application. There is no code bloat from unused code.

<h2 class="page-header"
The Preset Initializer
</h2>

The composition `Uno` defines one method: a `preset` initializer. This is a special initialization method that can only be defined in compositions.  The `preset` initializer supports configuration and initialization.
More information can be found 
<a href="{{site.url}}/pollen/guide/host-initialization#ref-preset">here</a>.


<h2 class="page-header"
id="ref-export-types">
The Export Statement : Types
</h2>

The export statement is only available in compositions. 
The list of exported types is the interface that is available to clients that
import the composition. 

This is the list of exports in the `Uno` composition:

    export Mcu
    export GlobalInterrupts
    export Led
    export PB4
    export PB3

If `MyApp` imports `Uno` this way: 

    import Uno
    from Uno import PB4 as MyPin        # PB4 as MyPin

Then the function `toggle()` of the `PB4` module could be invoked via `MyPin`: 

     MyPin.toggle()                     # call into PB4 via MyPin

The other exported types of `Uno` are also available because of the `import Uno`
statement. However they do not have local names.  
Calling the function `Led.on()` can be done using full qualification:

     import Uno
     ...
     Uno.Led.on()                       # a call into Led with full qualification
     ...



<h2 class="page-header"
id="ref-export-fun">
The Export Statement : Functions
</h2>

The export statement can be used to export specific functions from compositions. 

If a module `Core` implements a set of functions which includes `wait()` and `cycle()` and the composition `ATmega328` imports `Core`, then these functions can be exported. Here is how that export of functions would look:

    import Core
       ... 
    composition ATmega328 {
       ...
       export Core.wait                # an exported function
       export Core.cycle
       ...
    }

Any importer of ATmega328 can then invoke these functions through the name ATmega328:

    import ATmega328 as MyArduino
       ... 
    module MyApp {
       ... 
       myFun() { 
         MyArduino.wait()             # calling an exported function via a local name
         MyArduino.cycle()
       }
       ... 
    }

Exporting individual functions by name can be expressive and useful when the
exported function can be thought of as operating on the composition (or
application) as a whole.
The function `wait()` can be thought of as implementing
functionality for the application on specific hardware.
