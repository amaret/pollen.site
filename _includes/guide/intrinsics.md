<h1 id="arrays" class="page-header">Intrinsics</h1>

<p class="lead">Pollen has several different kinds of intrinsics: a set of <a
href="#ref-intrin-lifecy">application lifecycle intrinsics</a>, as well as
intrinsics for <a href="#ref-intrin-slpwake">sleep wake</a>, <a href="#ref-intrin-assert">assert</a> and <a
href="#ref-intrin-uname">the name of the currently executing unit</a>.</p>

Pollen intrinsics provide common interfaces and protocols that applications can
rely on yet they are customizable for variable hardware and software
requirements.

<h2 class="page-header"
id="ref-intrin-lifecy">
Application Lifecycle Intrinsics 
</h2>

Every device application has a lifecycle. At each stage of the lifecycle the
application may need to perform critical operations to ensure a proper
execution environment. For example, upon applying power to the device,
the microcontroller is reset at which time it must be configured
properly to ensure the rest of the application can execute. 
Most device applications are intended to run
perpetually with a power-off condition indicating failure. However,
some applications require the ability to be shutdown and they may need
specific operations performed during the shutdown process.

Pollen supports a set of intrinsic functions which serve as entry-points for
developers into a module's lifecycle at runtime. Functionality
implemented in these intrinsics is commonly found in existing embedded
applications although where it resides and how it is integrated into an
application's structure varies with the application. Having these entry
points standardized in Pollen with knowledge of their invocation at
specific points of runtime makes understanding application
functionality more straightforward.

The application lifecycle intrinsic functions defined by Pollen are
`pollen.reset()`, `pollen.run()`, `pollen.shutdown()`, and `pollen.ready()`.

<h4 class="page-header"
id="ref-intrin-init">
Startup: Initialization with Intrinsics and Constructors
</h4>

The startup initialization intrinsics are `pollen.reset()`, `pollen.ready()`,
and `pollen.run()`.

This is the order of initialization:

- Upon powering up the microcontroller, the first function called is `pollen.reset()`. 
- Then each module constructor is called. (The order in which module constructors are executed is undefined.) 
- After all constructors have completed, `pollen.ready()` is called. 
Thus an implementation of `pollen.ready()` can perform any cross module
initialization which requires that each individual module has already been initialized.
- Finally `pollen.run()` executes and the application starts. 

For both `pollen.reset()` and `pollen.ready()` 
system defined defaults exist. If the user defines one it will take precedence. 

For `pollen.run()` there is no default and the user must define one in the top
level module. (Note `pollen.run()` is also where the pollen application startup
code is generated.)

<h4 class="page-header"
id="ref-intrin-shutdown">
Shutdown
</h4>

Since the majority of embedded systems are intended to operate indefinitely,
the intrinsic `pollen.shutdown()` can be used to gracefully enter fail states should
they be encountered at runtime.

For `pollen.shutdown()`, a system defined default exists. If the user defines one it will take precedence. 

Only one `pollen.shutdown()` can be defined.

<h2 class="page-header"
id="ref-intrin-other">
Other Intrinsics 
</h2>

<div class="alert alert-success" role="alert">
  <span class="glyphicon glyphicon-leaf"></span>
     Look for dynamic memory management intrinsics 
     in the next release.
</div>

<h4 class="page-header"
id="ref-intrin-slpwake">
Sleep Wake
</h4>

The two sleep wake constructors are `pollen.sleep()` and `pollen.wake()`.
They do not have default implementations. 
You can define a module that implements these functions and then bind it to the 
SleepWakeProtocol:

     pollen.sleepWakeProtocol := SleepWakeImpl

This binding can occur anywhere and then the functions 
`pollen.sleep()` and `pollen.wake()` are available everywhere.

<h4 class="page-header"
id="ref-intrin-uname">
Unitname 
</h4>

It can be useful to have a variable that contains the name of the
currently executing unit. `pollen.unitname` is that variable. It is an
intrinsic string variable which holds that name. It can be used the way
any string variable could be used. It is only generated if accessed and
it does not need to be declared.

<h4 class="page-header"
id="ref-intrin-assert">
Assert
</h4>

The assert intrinsic takes the form `pollen.assert(condition, message)`. The
`condition` is a conditional expression that is tested at runtime. If it is true
then the `message` is output. 

For assertions to be in effect the `-a` option has
to be passed to the Pollen translator. In addition the print protocol must be
bound to a print implementation. If these conditions are not satisfied the
assert is a noop. 
