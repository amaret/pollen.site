
How to Define and Use Modules
==============================
 
The most fundamental type in Pollen is the module. It can be thought of as a singleton class. The top level unit presented to the Pollen translator must be a module. A module imports the units it needs and then defines (public or private) functions and data members, which are all private. 

Modules implement information hiding and a separation of concerns. For example an Led module provides a public interface for its `on()` and `off()` methods but the implementation is hidden as are the data members of the Led. Likewise, separating the functionality of an Led from a Timer by implementing them in separate modules provides a clear and comprehensible design that is easier to maintain and reuse.

Relative to other programming languages modules have particular importance in Pollen. This reflects the problem domain. An embedded application is inseperable from its embodiment in hardware. Leds, pins, and other components are better modeled with static singleton classes than with dynamic object instances. Note that classes are also supported in Pollen and are often used for software abstractions (such as Events or Queues) which lack concrete physical embodiment. 

Other important characteristics of modules include:
1. Inheritance is not supported. 
2. Modules can implement protocols. (A protocol is an interface without subtyping. See the section on protocols and protocol members.)
3. Modules are constructed. They have constructors which are invoked at application startup. 
4. Module functions can be public or private.
5. A public function `foo()` in module `Mod` is invoked from outside the module with the syntax `Mod.foo()`.

Here is an example module that is implementing a standard integrated circuit bus.  This bus (often called 'eye-squared-see' or `I2C`) provides good support for communication with various slow, on-board peripheral devices that are accessed intermittently, while being extremely modest in its hardware resource needs. It is a simple, low-bandwidth, short-distance bus. 

This version of the `I2C` module is hardcoded for the ATmega328.  Pollen contains many constructs that support abstraction and code reuse that can be used to make this code more generic. It is possible to isolate the target hardware dependencies so that modules are easily reusable. Later examples will demonstrate those capabilities. 

After the package statement, that identifies the package, the code begins with import statements, then the module proper begins, with definitions of data and functions. 

    package atmel.atmega
    import ATmega328
    from ATmega328 import TwoWireInterrupt as TWInterrupt 
    import Cpu
    
    module I2C {
    
      enum Status { OK = 0,             // Operation succeeded
                    ERROR = 1,          // Unspecified error
                    UNSUPPORTED = 2,    // Operation not supported
                    NOSLAVE = 3,        // Slave not responding
                    BUSBUSY = 4 }       // Communication ongoing on the bus
    
      enum BusSpeed { LOW = 0,          // 10kHz
                      STANDARD = 1,     // 100kHz
                      FAST = 2,         // 400kHz
                      FASTPLUS = 3 }    // 1MHz
          
      host bool isMaster = true
      host uint8 busSpeed = BusSpeed.STANDARD  
      host uint8 prescaler = 0
      host uint8 bitrate = 0
      
      host I2C() {
        TWInterrupt.setHandlerOnHost(i2cISR)
      }
    
      I2C() {
        initialize()
      }
    
      public host setMasterMode(uint32 speed) {
        isMaster = true
    
        if (speed == 10000) {
          busSpeed = BusSpeed.LOW
        } elif (speed == 100000) {
          busSpeed = BusSpeed.STANDARD
        } elif (speed == 400000) {
          busSpeed = BusSpeed.FAST
        } elif (speed == 1000000) {
          busSpeed = BusSpeed.FASTPLUS
        } else {
          print "Unsupported bus speed " + speed + ". Setting to Standard (100kHz).\n"
        }
    
        uint16 val = ((Cpu.getFrequencyOnHost() / speed) - 16) / 2
    
        if (val < 0) {
          uint32 freq
          print "I2C Error: Cannot support I2C speed (" + speed + ") with current MCU frequency\n" 
        } else {
          while (val < 0 || val > 255) {
            ++prescaler         // increment prescaler
            val >>= 2           // divide by 2 squared
          }
          if (prescaler > 3) {
            print "I2C ERROR: Cannot support I2C frequency (" + speed + ")"
          } else {
            bitrate = val
          }
    
          print "I2C: speed=" + speed + " bitrate_val=" + val + " prescale_val=" + prescaler + "\n"
        }
      }
    
      public host setSlaveMode(uint32 speed) {
        isMaster = false
    
        // CPU clock frequency in slave mode must be 
        // at least 16 times higher than the SCL frequency
        if (Cpu.getFrequencyOnHost() < (16 * speed)) {
          print "I2C Error: MCU frequency in slave mode must be at least 16 times higher than bus speed"
        }
    
      }
    
      public initialize() { 
    
        // Ensure that TWI is not in power reduction
        +{PRR &= ~(1<<PRTWI)}+
        
        // Set prescale and bit rate registers
        +{TWSR}+ = prescaler
        +{TWBR}+ = bitrate
    
      }
    
      public uninitialize() { }
      public setBusSpeed(uint8 speed) { } 
      public clearBus() { }
      public releaseBus() { } 
      public resetBus() { } 
      public put(uint8 address, uint8 data) { }
      i2cISR() { 
          // handler code
      }
    
    }

This module does not show full implementations for all functions but there are still a number of quite interesting features in a practical context. We will discuss it from top to bottom, starting with the import statements.

Using Import Statements
-----------------------

     import ATmega328

Recall that the Pollen translator is called with a top level module and a set of bundles. The bundles contain packages and in turn packages contain Pollen files. As a result of the import statement above, the Pollen file `ATmega328.p` is imported. Its bundle is `atmel`. Thus the Pollen translator, to have access to this file, would be called with `-b @atmel`, where `-b` is the bundle option. (Note that '@' is used for bundles which reside in the cloud with the Pollen translator. There is an `atmel` bundle in the cloud. These bundles can also be downloaded and accessed locally.) 

The Pollen file `ATmega328.p` is a composition. This is a special sort of module that 'composes' a subsystem from diverse components. For example an MCU is modeled in Pollen as a composition. From a high level point of view a microcontroller or MCU is a whole subsystem. From a lower (closer) point of view the microcontroller is composed of a set of hardware components. The composition assembles and configures a set of modules for these hardware components and presents a view of them together as a whole subsystem. 

The `Atmega328` composition brings together modules implementing cpu, interrupts, gpio pins, and timers, among others.  The statement `import ATmega328` makes all these modules available for import by `I2C`. The following line selects the specific functionality in `ATmega328` which is needed in `I2C`: 

     from ATmega328 import TwoWireInterrupt as TWInterrupt 

This means that `I2C` will use the TwoWireInterrupt module via the local name TWInterupt. Note that the import of `ATmega328` does not mean that `I2C` will be bloated by code in `ATmega328` which `I2C` does not use. Unused code from `ATmega328` will not be included in the application. 

Here is the final import statement in `I2C`: 

     import Cpu

`Cpu` is a simple module (not a composition) in the `atmel` bundle which contains functions `reset()`, `shutdown()`, and `wait()`, among others, with implementations specific to the atmel platform. 

We have seen from these import statements a few of the ways Pollen supports modularity and separation of concerns. For example,  an individual module can be implemented to support a gpio pin, and then this module can be flexibly assembled with other kinds of modules into a Mcu composition. Then the gpio pin can be selectively imported from the Mcu composition, according to current requirements. An important benefit of this modularity is a high degree of extensibility and code reuse. Compositions can be reused in a variety of ways across different applications. They can also be extended via the extends clause (a form of inheritance). For more details see the section on compositions.

Using Enum Declarations
-----------------------

After the imports statements the module definition of `I2C` begins. The module contains a variety of definitions of code and data. Note that it begins with two enums, `Status` and `BusSpeed`. These provide named values to sets of constants. Enums can be nested within other types or they can be the only type in a file. For more information see the section on enums.

Using Host Functions and Host Data
----------------------------------

The enums are followed by several declarations of simple variables of primitive type. These variables are declared with the `host` attribute, for example:  

     host bool isMaster = true

In Pollen both code and data can be declared with the `host` attribute.  The word 'host' refers to the host where the translator itself is run. For functions, the `host` attribute means that the function will be translated into a script that will be executed in the translator context, on the host. This code execution phase is called the host phase -- host functions run during the host phase.  They do not exist in the application as it is run on target hardware.  Using host constructors and host functions we have off loaded initialization and configuration from the application running on the target hardware to the resource rich host, where the translator is executing. 

Host functions are used to calculate the initial configuration of the module. They set the initial values of `host` data. 

The value of this feature is multi faceted. We explore it in this section, as well as the sections on classes, protocols, and compositions, and in addition there is a section dedicated to host initialization. Below we begin to discuss it with an example using the `isMaster` variable. 

There are two host functions, `setSlaveMode()` and `setMasterMode()`, which initialize the `isMaster` flag. They also initialize another set of host variables whose value depends on the setting of this flag: `busSpeed`, `prescaler`, and `bitrate`. These host functions are called during the host phase from outside the I2C module. That is, the clients of this module set whether this is a master or slave by calling one of these host functions, depending on client requirements. This facilitates code reuse. Through flexibile configuration capabilities, the module is suited to reuse in a variety of contexts without changing the source code of the module. 

There is an additional aspect of host initialization that has particular value in the embedded context. A host variable of primitive type which is assigned during the host phase is initialized as a constant. On many embedded systems, there is much more program Flash (or ROM) than RAM. Therefore, if variables do not change during execution, it reduces pressure on RAM to allocate them as constants in Flash. In this example, all of the host variables `isMaster`, `busSpeed`, `prescaler`, and `bitrate`, will be allocated as constants in Flash. These data items are naturally variable during the host phase but constant during application execution because they reflect different use cases for hardware that are inherently constant once execution begins - bus speed, master or slave, etc. 

Host functions and host data allow Pollen to combine the configuration flexibility of initialization via code with the efficiency of allocating configuration variables as constants.  Host functions can also allow the application to off load computation requirements from the target system (where they can impact performance) to the resource rivch host system, thus increasing application performance.

Embedded applications often have a high degree of similarity in their code functionality, to do the basic work of controlling the hardware, within a context of high variability and complexity in initial configuration. Pollen facilitates code reuse by supporting sophisticated configuration capabilities during the host phase that allows the same code to operate under a variety of  configurations. 

This is an introduction to these capabilities. We will explore this topic further in subsequent sections.

Using Module Constructors
-------------------------

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

Module constructors, both host and target, take no parameters and are only called once, by the system. They are public only. The order of execution of constructors is undetermined with one exception - the constructor of the top level module is run after all the others.

Using Injected Code
-------------------

Pollen supports directly including C code through injection. In our example the target constructor calls the function `initialize()` and this function shows one way to use injected code. 

      public initialize() {
    
        // Ensure that TWI is not in power reduction
        +{PRR &= ~(1<<PRTWI)}+
    
        // Set prescale and bit rate registers
        +{TWSR}+ = prescaler
        +{TWBR}+ = bitrate
    
      }

The code injection blocks in `initialize()` are initiated by `+{` and end with a matching `}+`. The code between these markers is C code. In this example the injected code consists of register definitions that come from C header files for this target platform. Code injection blocks can be used to include C header files, functions, declarations, statements, and even expressions in Pollen programs. This degree of support for integration with C makes it easy to access the benefits of Pollen in any context where C is used, which includes virtually all embedded software development shops. It is another way in which Pollen supports code reuse. For more details see the section on code injection.
