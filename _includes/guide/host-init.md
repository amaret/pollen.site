<h1 id="host-init" class="page-header">Host Initialization</h1>

<p class="lead">Host initialization defines the configuration and initial state of the application.</p>

Host initialization is one of the more novel features of Pollen. Understanding it is easier in the context of practical examples, usage cases, and code. We will first define it and then discuss its usage and value.

This section assumes a basic understanding of Pollen modules, classes, protocols, and compositions.

<h2 class="page-header">What is Host Initialization?</h2>

Host initialization defines the configuration and initial state of the application.

A Pollen program is translated to C on a host computer and then loaded into and run on a target microcontroller. The build flow on the host is pictured below. Note that the Pollen translator produces initialization scripts as well as C files. Pollen uses C simply as a portable assembly language.

<div style="padding: 20px 40px;">
  <img src="{{site.url}}/pollen/static/img/buildflow.jpg" width="700" alt="Pollen Build Flow" />
</div>

The initialization scripts are executed by the Pollen translator during the translation and the results determine the initial state of Pollen variables and objects when the application runs on target hardware.

The term host phase refers to the execution of these initialization scripts on the host computer. To make the program more efficient and robust, the host phase can handle complex initialization and allocation that in other programming languages must be done at runtime. Pollen off-loads this work to the host computer via the initialization scripts saving runtime and hardware resources. This is what is meant by the term host initialization.

<!--

---------------

**MEGAN: CAN YOU INTEGRATE THIS NEXT PARAGRAPH INTO THIS SECTION SAVING ANY REDUNDANCY**

In practice, host initialization is about levearging all the information that is known at build time yet distributed across various files in an application to produce more efficient code saving precious hardware and runtime resources. Additionally, host initialization allows code to be written in such a way that it can adapt itself build-time to varying hardware configurations and resources, collectively the hadware environment. Being able to write code in such a manner produces an efficient software development process where code can be written once and reused effectively in drastically different hardware environments 

---------------

**I'm not so happy with the way this paragraph reads. Its quite complex and needs to be more straightfoward. Its bit cryptic and the paragraph above makes some of this redundant**
-->

Embedded applications often have a high degree of similarity in their code
functionality - such as the basic work of controlling the hardware - within a
context of high variability and complexity in initial configuration. Pollen
facilitates code reuse by  supporting sophisticated configuration capabilities
during the host phase that allows the same code to adapt itself to operate under a
variety of  configurations.

Note that host initialization can also make code easier to reuse. Configuration and initialization
can be handled via host initialization in ways that minimize source code changes
for different applications and contexts. We will see examples of this below.

<h2 class="page-header" id="ref-hostfcns">Host Functions</h2>

A function is a host function if it is defined with the `host` attribute:

     host foo() { print "executed at host time" }

A function without the `host` attribute is a target function.

     bar() { print "executed at target time" }

Host functions do not exist in the application as it runs on the target
hardware - they have no presence in target code. They are present and executed during the host phase only.
Host functions cannot call target functions and target functions cannot call host functions.

The host attribute can appear on function definitions including module and
class constructors. Host constructors are called by the translator during the
host phase (and host functions are callable by host constructors).

The declaration below will result in the invocation of the `MyClass` host constructor. Note that the `new` keyword used with the attribute `host` invokes the host class constructor. The result will be an object that will be statically initialized during target application start up.

    host MyClass ref = new MyClass(1)

<h2 class="page-header" id="ref-hostdata">Host Data</h2>

Data items can be declared host. This includes simple data items of primitive type, objects of class type, arrays, and function references.

    host bool isMaster = true

A host variable of primitive type which is assigned during the host phase is initialized as a constant.
This has particular value in the embedded context.
Microcontrollers tend to have 8 to 16 times more program memory (Flash or ROM) than data memory (RAM). Therefore, if variables do not change during execution, it reduces consumption of data memory to allocate them as constants which are stored in program memory.

There are a number of use cases for host data.

<h4 id="ref-hostdata-simplevars">
AMI: I think a better use case is the UART example
Use Case: Simple Host Variables of Primitive Type
</h4>

The first use case we'll examine shows host variables of primitive type. This comes from the `I2C` <a href="{{site.url}}/pollen/guide/modules#ref-I2C">example in the section on modules</a>. The module declares four host data items of primitive type:

    host bool isMaster = true
    host uint8 busSpeed = BusSpeed.STANDARD
    host uint8 prescaler = 0
    host uint8 bitrate = 0

This module can be either master or slave, and that is configured by clients of
the module through two host functions. A client will either call the first or
second routine below, depending on configuation choices:

      public host setMasterMode(uint32 speed) {
        isMaster = true
        ...
      }

      public host setSlaveMode(uint32 speed) {
        isMaster = false
        ...
      }

These functions each initialize another set of host variables whose value
depends on the setting of the `isMaster` flag: `busSpeed`, `prescaler`, and
`bitrate`. Thus the `I2C` module can be configured flexibly, as master or slave,
depending on client requirements and without changing I2C source code.

Also all of these host variables will be allocated as constants in Flash. These data items are naturally variable during the host phase but constant during application execution because they reflect different use cases for hardware that are inherently constant once execution begins - bus speed, master or slave, etc.

<h4 id="ref-hostdata-classvars">
Use Case: Host Variables of Class Type
</h4>

The test program `TimerBlink` declares a host `Timer` object:

    host Timer t1 = new Timer(tick1)

This is a host declaration so the host constructor for `Timer` will be executed
during the host phase.
When the application begins execution on the target hardware, the
`Timer` (and the host `Event` object it contains) are statically initialized.
This avoids dynamic memory allocation, configuration, and initialization. This is more efficient, which is important for embedded applications.

We also create more robust systems by eliminating dynamic memory allocation. As
this is a statically allocated object there will be no memory leaks.

Note that with dynamic memory allocation, the state of the heap can vary. Using dynamic
memory allocation  makes a program non-deterministic.  Many embedded applications are mission critical, where application failure means a risk of loss of life. For such applications, deterministic program behavior is always preferred and often required. Host initialization addresses these issues, as it allows you to avoid dynamic memory allocation in a way that is intuitive and straightforward.

<h4 id="ref-hostdata-arrays-hostdim">
Use Case: Arrays with Host Dimensions
</h4>

`Timer` clients should be able to request new timers without changing any code in the
`Timer` module.  This issue is handled in other languages by computing the data
structure size at runtime and then allocating it dynamically. In Pollen, for the
embedded context, we wish to avoid dynamic memory allocation. That means the
internal `Timer` array should have constant size. How can we grow arrays when they are defined
as having constant size without changing the internal `Timer` implementation?

It's straightforward to do this in Pollen. We use a host variable to hold the
array size. Then it will be computed during the host phase. At load
time, the array size is a constant.
Then the array can be allocated and initialized statically to that constant
size. This is how the Timer module is implemented in `pollen-core` cloud bundle.

Here are the relevant declarations in `TimerManager`:

    host uint8 numMsTimers = 1
    Timer msTimers[numMsTimers] = {null}

The array `msTimers` should be allocated to be the right size to hold all timers. During the host phase, the host constructor for `Timer` calls `registerTimerOnHost` to increment that size for each new `Timer`. Here is the host constructor for `Timer`:

      public host Timer(HP.handler h) {
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

Then at program startup the internal `Timer` array `msTimers` will have the correct (static) size of 3.


<h2 class="page-header" id="ref-preset">The Preset Initializer</h2>

**AMI: I'm not sure this should talk about what it does. Basically, the preset initializer is a feature of compositions. It allows a composition to configure a set of things without other compositions that are imported into that composition to interfere with those settings. What is described here is not quite right and the fact that there is private access is not a good idea. I don't think it should be documented**

The preset initializer is a type of host initialization. It is a special
routine that is supported only for compositions. Like all code defined
in compositions, it executes during the host phase. Recall that the purpose of
compositions is to assemble, configure,  and initialize sets of modules during
the host phase. The preset initializer provides an additional mechanism for
compositions to fullfill this purpose.

A unique feature of the preset initializer is that it can initialize module
private data in any of its modules. It provides access from outside the module
to private data. This allows modules to be configured according to the
requirements of their clients. It also enables modules to adapt to hardware
variability without changes to their source code.

Here the private variable `clk_rate` declared in `MyApp` is being configured in a
composition `Config`.

    from Mcu import MyApp
    composition Config {

       preset Config() {

          MyApp.clk_rate = CLOCK_RATE

       }
    }

In preset initializers protocol members can be bound and variables which have
been declared either
in module scope or class scope can be initialized. More specifically these variable
initializations are supported:

* Target variables declared in module scope can be initialized to constants.
* Host variables declared in module scope can be initialized to expressions or (host) function returns.
* All variables declared in class scope (host and target) can be initialized to constants.

The section on compositions contains another example of the preset initializer usage.
That example shows how protocol members can be bound and host functions can be called in preset initializers.

<h2 class="page-header" id="ref-host-init-order">Order of Host Initialization </h2>

This is the order of host initialization phases:

1. Host variables are initialized to the values on their declarations.
2. Preset initializers are executed.
3. Host constructors are executed, along with any host functions they call, in an undefined order.

<div class="alert alert-success" role="alert">
  <span class="glyphicon glyphicon-eye-open"></span> 
  The host constructor for the top level module will always run last.
</div>

