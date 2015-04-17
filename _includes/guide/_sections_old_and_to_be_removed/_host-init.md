How to Use Host Initialization
==============================

Host initialization is one of the more novel features of Pollen. Understanding it is easier in the context of practical examples, usage cases, and code. We will first define it and then discuss its usage and value. 

Note that this section will be better understood if the sections on Pollen types (modules, classes, protocols, compositions) are read first.

What is Host Initialization? 
-----------

Host initialization defines the configuration and initial state of the application.

A Pollen program is translated to C on a host computer and it will load and run on a target microcontroller. The build flow on the host is pictured below. Note that the Pollen translator produces initialization scripts as well as C files.

![img:pollen build flow](./images/buildflow.jpg "Pollen Build Flow.")

The initialization scripts are executed by the Pollen translator during the translation and the results determine the initial state of Pollen variables and objects when the application runs on target hardware.

The term host phase refers to the execution of these initialization scripts on the host computer. To make the program more efficient and robust, the host phase can handle complex initialization and allocation that in other programming languages must be done at runtime. Pollen off loads this work to the host computer via the initialization scripts. This is what is meant by the term host initialization. 

Note that host initialization can also make code easier to reuse. Complex configuration and initialization (which often characterizes embedded applications) can be handled via host initialization in ways that minimize source code changes when modules are reused for different applications and contexts. We will see examples of this below. 


Defining Host Functions
---------

The host attribute can appear on function definitions (including constructors). Host functions do not exist in the application as it runs on the target hardware. They are callable during the host phase only. If a function does not have the host attribute it is target function by default (and as such is callable in the final application). Host functions cannot call target functions and target functions cannot call host functions. 

Host functions are called by host constructors. Host module constructors are called by the system during the host phase.  

Compositions are a type of module and they can declare host functions and host constructors. In fact they cannot declare target functions. They have no code that executes in the target application. Compositions assemble, configure,  and initialize sets of modules so their purpose is host phase only.

Host class constructors are called for objects of class type that are declared host. The `new` keyword is used to invoke the host class constructor. Note this is a host phase `new` and its result is an object that will be statically initialized during target application start up.

    host Class1 ref = new Class1(1) // host constructor executes during the host phase 

Defining Host Data
---------

Data items can be declared host. This includes simple data items of primitive type, objects of class type, arrays, and function references. We'll explore the effect of the host attribute on a simple data item below in the use case for simple host variables.

Use Cases for Host Initialization
---------

1. Simple Host Variables of Primitive Type

The first use case we'll examine shows host variables of primitive type. It is from the example used in the section on modules, `I2C`. This module declared four host data items of primitive type:

    host bool isMaster = true
    host uint8 busSpeed = BusSpeed.STANDARD  
    host uint8 prescaler = 0
    host uint8 bitrate = 0

This module can be either master or slave, and that is configured by clients of the module through two host functions. A client will either call: 

      public host setMasterMode(uint32 speed) {
        isMaster = true
        // more code follows
      }

Or the client will call:

      public host setSlaveMode(uint32 speed) {
        isMaster = false
        // more code follows
      }

These two functions also initialize another set of host variables whose value depends on the setting of the `isMaster` flag: `busSpeed`, `prescaler`, and `bitrate`.  This host phase configuration facilitates code reuse. Through flexibile configuration capabilities, the module is suited to reuse in a variety of contexts without changing the source code of the module. 

These host phase variables after being configured in the host phase can be used as constants in the target application. This is an additional aspect of host initialization that has particular value in the embedded context. A host variable of primitive type which is assigned during the host phase is initialized as a constant. On many embedded systems, there is much more program Flash (or ROM) than RAM. Therefore, if variables do not change during execution, it reduces pressure on RAM to allocate them as constants in Flash. In this example, all of the host variables `isMaster`, `busSpeed`, `prescaler`, and `bitrate`, will be allocated as constants in Flash. These data items are naturally variable during the host phase but constant during application execution because they reflect different use cases for hardware that are inherently constant once execution begins - bus speed, master or slave, etc. 

2. Host Variables of Class Type

The second use case host variables of class type. It uses the examples for timers, which is both in the section on classes and the section on protocols. The test program `TimerBlink` declares a host timer:

    host Timer t1 = new Timer(tick1)

As this is a host Timer object declaration, the host constructor for Timer will be called.  Using host constructors we have off loaded initialization and configuration from the application running on the target hardware to the resource rich host, where the translator is executing. When the application begins execution on the target hardware, the `Timer` (and the host `Event` object it contains) are statically initialized.  We've avoided dynamic memory allocation, configuration, and initialization. This is more efficient, which is important for embedded applications. 

We also create more robust systems by eliminating dynamic memory allocation. There can be no memory leaks.  Also, with dynamic memory allocation, the state of the heap can vary. Using malloc() makes a program non-deterministic.  Many embedded applications are mission critical, where application failure means a risk of loss of life. For such mission critical applications, deterministic program behavior is always preferred and often required. Host initialization addresses all these issues, as it allows you to avoid dynamic memory allocation in a way that is intuitive and straight forward. 


3. Arrays with Host Dimensions

In the timer implementation in Pollen, its desireable to be able to add more timers without having to grow any internal data structures. That is, the clients of the timer implementation should be able to add new timers without changing any code in the timer modules. This reflects the Pollen goals of enabling code reuse and configurablility without code change. Generally this issue is handled in other languages by computing the data structure size at runtime and then allocating it dynamically. In Pollen, for the embedded context, we wish to avoid dynamic memory allocation. That means our arrays should have constant size. How can we grow arrays of constant size without changing the internal timer implementation code?

It's straightforward to do this in Pollen. We use a host variable to hold the computed array size (it is computed during the host phase). Then at load time, the array size is a constant (as we have seen above, the host simple variables become runtime constants). Then the array can be allocated and initialized statically to that constant size. This is how it is implemented in the timer modules in the `pollen-core` cloud bundle. 

Here is the array declaration and the host variable declaration for the array size in `TimerManager`:
    host uint8 numMsTimers = 1
    Timer msTimers[numMsTimers] = {null}

The array `msTimers` should be allocated to be the right size to hold all timers. During the host phase, the host constructor for `Timer` calls `registerTimerOnHost` to increment that size for each new `Timer`. Here is the host constructor for `Timer`:

      public host Timer(HP.handler h) {
          @tickEvent = new Event(h)               
          TimerManager.registerTimerOnHost(@)     // Notify the TimerManager of this Timer
      }                                             

The function `registerTimerOnHost` will increment the host variable `numMsTimers`:

    public host registerTimerOnHost(Timer t) {
        numMsTimers += 1
    }

At the end of the host phase `numMsTimers` will have been incremented for every timer created. The array `msTimers` can be statically allocated and initialized. If the client adds two new timers:

    host Timer t1 = new Timer(tick1)
    host Timer t2 = new Timer(tick2)
    host Timer t3 = new Timer(tick3)

Then at program startup the `msTimers` array will have the correct (static) size of 3.

Using the Preset Initializer
---------

Another type of host initialization is supported with the preset initializer. This is a routine that is supported only for compositions. Like all functions defined in compositions it executes during the host phase. The purpose of compositions is to assemble, configure,  and initialize sets of modules during the host phase. The preset initializer provides an additional mechanism for the composition to fullfill this purpose. 

A unique feature of the preset initializer is that it can initialze module private data in any of its modules. It provides access from outside the module to private data. This allows modules to be configured according to the requirements of their clients. This also fulfills one of the design goals of Pollen in that it makes modules more reusable because they can be used in a variety of contexts without changes to their source code. 

Here the private variable `clk_rate` in `N` is being configured in a composition `C`. 

    from Mcu import N
    composition C {
       preset {
          preset N.clk_rate = CLOCK_RATE // clk_rate is a private variable declared in module N
       }
    }

Another example of the preset initializer is shown in the section on compositions. In that example you will see how protocol members can be bound and host functions can be called in preset initializers. 

This is what can be initialized in preset initializers:

- Protocol members can be bound
- Module scope variables and class scope variables can be initialized.

In the context of preset initializers there are slight differences in semantics for host and target data members.

- Host variables declared in module scope can be initialized in preset initializers to expressions or function returns.
- Target variables in module scope or all class scope variables must be initialized to constants. 

Order of Host Initialization
---------

This is the order of host initialization phases: first host variables are initialized to the values on their declarations. Then preset initializers are run. Finally host constructors and host functions are run, in an undefined order. (Host constructors call host functions.) Note that the host constructor for the top level module will always run last.
