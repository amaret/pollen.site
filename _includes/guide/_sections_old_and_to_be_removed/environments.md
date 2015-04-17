How To Set a Target Environment On The Command Line
=======================

Embedded applications typically require significant effort in order to target new hardware. As a result of Pollen's support of portability, encapsulation, and code reuse, such targeting of new hardware can be much simpler. In fact it may be possible to accomplish it simply via a command line option. The `-e` option is used to specifiy a composition that configures and initializes a particular hardware environment. By changing the environment composition on the command line you can translate your program for new hardware. 

This Pollen program `TimerBlink` can be translated with the cloud compiler for the `Uno` using the `-e` option. This program uses the timer implementation and toggles an Led when the timer ticks. It also uses the event and led modules from cloud bundles. 

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

The Pollen translator command line shown below will translate this file for the Arduino Uno. Note the `-e` option specifying the Uno.  (Note that `-env` can also be used for the environment option.)  Other options shown below include `-t` for the toolchain and --mcu for target microcontroller. The `-o` options specifies the path to the output file. 

The bundles needed for the application are specified with the `-b` option. In this case cloud bundles are used which is signified by `@` before the bundle name. The `pollen-core` cloud bundle includes core functionality for leds, timers, events, and more. The `atmel` bundle contains files specific to that platform. The `environments` bundle contains compositions that initialize and configure the constituent modules for specific hardware contexts.

    pollenc.py 		                        \
        -o <output path>		            \
        -t avr-gcc --mcu atmega328p 		\
        -b @pollen-core 		            \
        -b @atmel 		                    \
        -b @environments 		            \
        -e @environments/arduino/Uno 		\
        TimerBlink.p		                    \
    

The C compiler output file will have the name TimerBlink-prog.out (<top level module name>-prog.out in the general case). Note that other tools may run on that file (e.g. objcopy) so what the final executeable name will be depends on the toolchain used. 

Here is the code for the environment composition `Uno`.  The imports and code show configuration and initialization specifically for the Arduino Uno target:

    !--
      Composition that defines an environment for the Arduino Uno
     --!
    
    from atmel.atmega import ATmega328 as Mcu // the Arduino Uno is based on the ATmega328
    from Mcu import GlobalInterrupts
    from Mcu import TimerMilliTC            // select timer driver
    from Mcu import Timer1MatchAInterrupt
    from Mcu import PB5                     // gpio pin
    from Mcu import PB4                     // gpio pin
    from Mcu import PB3                     // gpio pin
    
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

The Arduino Uno is based on the ATmega328. That is why we see above that the `Uno` composition first imports the `ATmega328` composition then selects, initializes, and configures specific peripherals and subsystems from it. Note that the Led.pin is mapped to PB5 (that is pin 5 of port B). We can see other configuration happening here: baud rate, frequency. The `ATmega328` composition configures all the resources of the board and the `Uno` selects what it needs.  In general an environment composition allows flexible reuse of modules while modeling, configuring, and initializing your hardware platform. The modules themselves are independent and encapsulated. 

Using the LocalHost Environment For Debugging

One of the environments which is available in the cloud bundle `environments` is `LocalHost`. This environment implements the functionality and services for the program in the local host environment so that the program can run there. Debugging on the resource rich host is is a frequent first step in bringing up an embedded application. It's often desireable to check program logic and do other testing there before deploying the application on target hardware. The Pollen cloud compiler's `-e` environment option makes this as simple as a change on the command line:

    pollenc.py 		                            \
        -o <output path>		                \
        -t localhost-gcc            		    \
        -b @pollen-core 		                \
        -b @localhost                           \
        -b @environments 		                \
        -e @environments/localhost/LocalHost    \
        TimerBlink.p		                        \

This is the command line to the cloud compiler which translates the same test that we previously translated for the Uno for the local host. Find the file TimerBlink-prog.out in the output directory and then run this file on your local host. 

This file will produce the following output:
    Pin.clear
    Pin.makeOutput
    Pin.set
    Pin.clear
    Pin.set
    Pin.clear
    Pin.set
    Pin.clear
    Pin.set
    Pin.clear
    Pin.set
    Pin.clear

This is simply printing out a trace of called routines. It shows that the program is executing correctly. One thing that is happening here is that the Pollen print statement is mapped to local host print functionality. This will be explored in detail in the section on how to use the Pollen print statement.

