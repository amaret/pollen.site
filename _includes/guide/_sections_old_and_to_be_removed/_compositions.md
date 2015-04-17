
How to Declare and Use Compositions
===================================

(NOTE It would be great to have a picture of a Mcu composition and its constituent components. Software modelling hardware.)

A composition is a configuration module. It is used to assemble and configure a set of modules that implement a subsystem.  

We've seen several examples which included the use of compositions. In the section on using modules our use case was a module which implements a standard integrated circuit bus, the `I2C`; this module imports the composition for the Atmega328p. That composition assembles and configures the constituents of the ATmega328p hardware target, including gpio pins, interrupts, timer, serial peripherals, and more. But the `I2C` doesn't need all of that. It is able to import just that element of the ATmega328 subsystem which it specifically requires - the `TwoWireInterrupt` - in this import statement:

    from ATmega328 import TwoWireInterrupt as TWInterrupt

There was another example of using compositions in the section on protocols and protocols members. There we saw that the hardware timer we used in our application was configured for the Arduino in the composition `Uno`.  The composition `Uno` performed that initialization along with others in this code:

    Led.pin := PB5
    Newsroom.GI := GlobalInterrupts
    TimerMilliTC1.TimerInterrupt := Timer1MatchAInterrupt
    TimerManager.HwTimer := TimerMilliTC1                   // hardware timer initialization
    Mcu.setFrequencyOnHost(16000000)
    Uart.setBaudOnHost(38400)

From these two examples we see the major uses for compositions:

1.  The modules that implement components of a subsystem, for example the gpio pins, the timers and interrupts, are encapsulated and independent. 
The composition supports building a flexible single interface from such a set of independent modules. This makes portability for multiple hardware targets much easier.

2. The composition enables initialization and configuration of a module outside of the module. Thus modules can be configured in order to be responsive to variable requirements of multiple hardware targets without changing any module code. This makes modules more reusable.

Through these two uses, compositions support portability, separation of concerns, and code reuse. 

The `Uno` composition provides a good example. Here is the complete code:

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

This composition is specific to the Arduino Uno. It reuses the `ATmega328` composition, but selects just what it needs: a timer, a timer interrupt, and 3 gpio pins (`PB3`, `PB4`, `PB5`). It also imports the event and timer abstractions and an Led. It also shows the typical form of a composition in that it imports modules and compositions, configures them through host functions, and exports functionality. 

In general, compositions can declare host constructors and host functions that are used to configure the constituent modules of the composition. These execute during the host phase only. The final results of the host phase determine the initial state of the application when it is loaded on to target hardware. 

Composition host constructors take no parameters and are called by the translator system. They are public only. The order of execution of composition host constructors (and in fact all module constructors) is undetermined. (Note however that the host and target constructor of the top level module will always run last.)

Using the Preset Initializer
---------

The composition `Uno` defines one method: a `preset` initializer. This is a special initialization method that can only be defined in compositions.  The `preset` initializer supports configuration and initialization of private data declared in the modules of the composition.  This is useful because it allows modules to be configured from outside the module, without changing their source code.  It can also bind protocol members to protocols and call host functions. 

In the preset initializer defined in `Uno`, 3 protocol members, `Newsroom.GI`, `TimerMilliTC1.TimerInterrupt`, and `TimerManager.HwTimer`, are bound to modules and two host functions are called: `Mcu.setFrequencyOnHost` and `Uart.setBaudOnHost()`. All configuration and initialization in the `preset()` initializer takes place during the host phase. 

Compositions import modules, configure modules through host functions (including host constructors and the preset initializer), then expose modules and functions via the export keyword. We have seen the imports and configuration of the `Uno` composition. Now we will discuss the export statement. 

Using the Export Statement : Types
---------

This is the complete list of exports in the `Uno` composition:

    export Mcu
    export GlobalInterrupts
    export Led
    export PB4
    export PB3

The list of types that are exported is the list of types that are available to clients that import `Uno`. 

For example, if your application has these two imports: 

    import Uno
    from Uno import PB4 as MyPin

Then you could invoke the function `toggle()` of the `PB4` module through the local name `MyPin`:

     MyPin.toggle() 

The other exported names of `Uno` are also available through the `import Uno` statement but they must be fully qualified if they are not specified in a `from Uno import ... ` form of the import statement. So the function `on()` in Led is available via the Uno import with full qualification:

     import Uno
     ...
     Uno.Led.on() 
     ...


Using the Export Statement : Functions
----------

Specific functions can also be exported from compositions. For example, if a module `Core` implements a set of functions which includes `wait()` and `cycle()` and the composition `ATmega328` imports `Core`, then these functions can be exported. Here is how that export of functions would look:

    import Core
       ... 
    composition ATmega328 {
       ...
       export Core.wait
       export Core.cycle
       ...
    }

Any importer of ATmega328 can then invoke these functions through the name ATmega328:

    import ATmega328 as MyArduino
       ... 
    module MyMod {
       ... 
       myFun() { 
         MyArduino.wait()
         MyArduino.cycle()
       }
       ... 
    }

    
Supplying a module in the export statment (e.g. `export GlobalInterrupts`) enables the importer to selectively import modules from the composition using the `from` clause of the import statement. We saw an example of this above with the statement `from Mcu import GlobalInterrupts`. The imported module implements a subsystem. By contrast, supplying a function name on the export statement (e.g. `export Core.wait`) can be expressive and useful when the exported functions can be thought of as operating on the composition as a whole. 


