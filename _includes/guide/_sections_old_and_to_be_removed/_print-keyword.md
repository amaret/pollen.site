How To Use Pollen Print
=================

The Pollen Print Statement Overview
--------------

The Pollen print statement can print strings, variables, and constants. For example: 

    print "Hello World!" + "\n" 

Items to be printed can be concatenated with the `+` operator.  Below the values of the variables sysFreq and ticksPerUs will be printed.  Note that a <newline> must be explicitly added:

    print "SysFreq = " + sysFreq + " Cpu.ticksPerUs is: " + ticksPerUs + "\n"

Here are the syntactic rules:

    printStmt -> printItem ( '+' printItem )*
    printItem -> stringLiteral | variable | booleanLiteral | numericLiteral | charLiteral

This syntax is the same in both host and target contexts although the implementation is different, as discussed below. 

Note that the variables are simple variables of primitive type. Structured types such as classes or modules are not supported in the print statement. 

Pollen Print Implementations
--------------

(You should be familiar with the material covered in the sections on pollen types before reading this section.)

This print statement is similar in syntax to print statements found in other languages. Print statements in host functions execute similarly to print in other languages, except they execute on the host, and then the output is downloaded to the client and displayed there.

What is unique to Pollen is that the print statement when it appears in target functions has no implementation unless the Pollen print protocol is bound to a print implementation. 

The reason for this can be seen after considering the context for embedded programs. Most embedded applications do not have support for printing functionality. They may be running without an operating system and they almost certainly have no peripheral printer. What a print statement means in such a context is implementation dependent. It may be a no-op. In Pollen, if no print implementation is bound to the application, then all print statements in target functions are no-ops. 

In fact, one of the primary uses of print output in developing embedded applications does not involve code running on target hardware. Instead print output is used when the application is going through an initial round of debugging by being run on the host, a resource rich development system. This debugging phase is used to trace and verify execution flow, among other things. We will show how to use the binding of a print protocol in Pollen to support this debugging approach. 

First we'll look into `pollen-core` cloud bundle which contains a `pollen.output` package. The protocol for print is there:

    protocol PrintProtocol {
    
      print_bool(bool b)
      print_int(int32 i)
      print_uint(uint32 u) 
      print_str(string s) 
    }

This is a set of function declarations that handle incoming types. (Note that structure types (class or module types) are not handled in these functions.) A print statement seen in Pollen target code will be translated to a sequence of calls to these functions. 

The implementation for the print statement must be a module that implements this protocol. The `localhost` cloud bundle  provides an implementation that can be used on the local host, during the debugging phase mentioned above: 

    
    from pollen.output import PrintProtocol
    
    module ConsolePrint implements PrintProtocol {
    
      +{ #include <stdio.h> }+     // C code injection to get stdio.h
    
      public print_bool(bool b) {
        if (b) {
          +{ printf("true") }+     // C code injection to call printf()
        } else {
          +{ printf("false") }+
        }
      }
    
      public print_int(int32 i) {
        +{ printf("%li", i) }+
      }
    
      public print_uint(uint32 u) {
        +{ printf("%lu", u) }+
      }
    
      public print_str(string s) {
        +{ printf("%s", s) }+
      }
    
    }

Binding the Pollen Print Protocol
--------------

In the local host context, the binding of the print protocol to this implementation maps Pollen print to the c library stdio.h. Only this binding in necessary to get prints in the Pollen program to print their operands. How is this binding accomplished?

In the section on setting the target environment on the command line we saw an example of setting the target environment to local host and then running our program so that it gave print output. That is, we saw how to use this command line:

    pollenc.py 		                            \
        -o <output path>		                \
        -t localhost-gcc            		    \
        -b @pollen-core 		                \
        -b @localhost                           \
        -b @environments 		                \
        -e @environments/localhost/LocalHost    \
        TimerBlink.p
    
to translate this program:

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

to get this output: 

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

Now we can examine in detail how this print output was generated. 

When the environment for localhost is specified with `-e @environments/localhost/LocalHost` on the command line, the translator uses composition `LocalHost` for the environment:

    from local.mcu import Mcu
    from local.mcu import TimerMilli
    from local.mcu import GlobalInterrupts
    from local.mcu import ConsolePrint
    
    from pollen.event import Newsroom
    from pollen.time import TimerManager
    
    from pollen.parts import LedMeta as Led
    from Mcu import Pin0
    
    composition LocalHost extends Mcu {
    
      preset LocalHost() {
        Newsroom.GI := GlobalInterrupts
        TimerManager.HwTimer := TimerMilli
        Led.pin := Pin0
    
        pollen.printProtocol := ConsolePrint    // bind the print protocol to an implementation
      }
    
      export Mcu
      export TimerMilli
      export GlobalInterrupts
      export Newsroom
      export Led
    }

The binding of the print protocol to the print implementation happens on the last line of the LocalHost `preset` method. If this line were not present, the print statements would all be no-ops.

Note that in composition `LocalHost` the source for the composition's modules is the package `local.mcu` (which is in bundle `localhost`). That means that these sources have been implemented for the local host and mostly what they do is print out their state. For example `Pin.set()` prints out "Pin.set\n". That means that the application that is translated with localhost as a target is set up to do a trace of program execution, just by using the `-e` option to select a local host target environment. This is how the output you see above is generated for this application. 

Finally, a print implementation can also be selected on the command line using the option `-p`. 

    pollenc.py 		                            \
        -o <output path>		                \
        -t localhost-gcc            		    \
        -b @pollen-core 		                \
        -p MyPrint                              \
        MyTest.p		                        \
    
Here `MyPrint` is a local implementation of print for test `MyTest`. 


