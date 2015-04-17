<h1 id="print" class="page-header">The Print Keyword</h1>

<p class="lead">
The Pollen `print` statement can print strings, variables, and constants. 
</p>

Here is a Pollen `print` statement: 

    print "Hello World!" + "\n" 

Items to be printed can be concatenated with the `+` operator.  Below the values of the variables sysFreq and ticksPerUs will be printed.  Note that a <newline> must be explicitly added:

    print "SysFreq = " + sysFreq + " Cpu.ticksPerUs is: " + ticksPerUs + "\n"

Here are the syntactic rules:

    printStmt -> printItem ( '+' printItem )*
    printItem -> stringLiteral | variable | booleanLiteral | numericLiteral | charLiteral | fcnRtn

Note that the variables are simple variables of primitive type (or function
returns of those types). Structured types such as classes or modules are not supported in the print statement. 

<h2 class="page-header"
id="ref-print-impl">
Pollen Print Implementations
</h2>

This print statement is similar in syntax to print statements found in other languages. Print statements in host functions execute similarly to print in other languages, except they execute on the host, and then the output is downloaded to the client and displayed there.

What is unique to Pollen is that the print statement when it appears in target
functions has no implementation unless the Pollen print protocol is bound to a
print implementation. 

The reason for this can be seen after considering the context for embedded programs. Most embedded applications do not have support for printing functionality. They may be running without an operating system and they almost certainly have no peripheral printer. What a print statement means in such a context is implementation dependent. It may be a no-op. In Pollen, if no print implementation is bound to the application, then all print statements in target functions are no-ops. 

<h4 class="page-header"
id="ref-print-dbg">
Using Print to Support Local Host Debugging
</h4>

One of the primary uses of print output in developing embedded applications does not involve code running on target hardware. Instead print output is used when the application is going through an initial round of debugging by being run on the host, a resource rich development system. This debugging phase is used to trace and verify execution flow, among other things. We will show how to use the binding of a print protocol in Pollen to support this debugging approach. 

<div class="alert alert-success" role="alert">
  <span class="glyphicon glyphicon-leaf"></span>
     In the Pollen context <em>local host</em> always refers to the resource
     rich host, not the target hardware.
</div>

The `pollen-core` cloud bundle contains a `pollen.output` package. It contains the protocol for print:

     protocol PrintProtocol {
     
       printBool(bool b)
       printInt(int32 i)
       printUint(uint32 u) 
       printStr(string s) 
       printReal(real f) 
       
     }

This is a set of function declarations that handle incoming types. (Note that structure types (class or module types) are not handled in these functions.) A print statement seen in Pollen target code will be translated to a sequence of calls to these functions. 

The implementation for the print statement must be a module that implements this protocol. The `localhost` cloud bundle  provides an implementation that can be used on the local host, during the debugging phase: 

     package local.mcu
     
     from pollen.output import PrintProtocol
     
     module ConsolePrint implements PrintProtocol {
       
       +{ #include <stdio.h> }+
     
       public printBool(bool b) {
         if (b) {
           +{ printf("true") }+
         } else {
           +{ printf("false") }+
         }
       }
     
       public printInt(int32 i) {
         +{ printf("%i", i) }+
       }
     
       public printReal(real f) {
         +{ printf("%f", (float)f) }+
       }
     
       public printUint(uint32 u) {
         +{ printf("%iu", u) }+
       }
     
       public printStr(string s) {
         +{ printf("%s", s) }+  
       }
     }
    
<h4 class="page-header"
id="ref-print-bind">
Binding the Print Protocol with Command Line Options
</h4>

In the local host context, the binding of the print protocol to this
implementation maps Pollen print to the C library stdio.h. After this binding,
the prints in the Pollen application will print their operands. 

This binding can be accomplished via command line option. We can show this with
the example of `TimerBlink.p` (source code 
<a href="{{site.url}}/pollen/guide/protocols#ref-protocol-timerblink">here</a>).
This code can be translated with an option that sets the target environment to
`localhost`.  The program
can then be run and its output will trace the code execution by means of print
statements. 

Shown below is the command line with local host options. The local host bundle
is used with `-b` and the `-e` environment options specifies the `LocalHost.p`
composition. 

    pollenc  -o out  -t localhost-gcc -b @pollen-core  -b @environments \
        -b @localhost                        \
        -e @environments/localhost/LocalHost \
        TimerBlink.p
    
Translating the program `TimerBlink.p` and then compiling and linking it with the local C
compiler we get this output:

    Pin.clear
    Pin.makeOutput
    Pin.set
    Pin.clear
    Pin.set
    Pin.clear
    ...


When the environment for localhost is specified with `-e
@environments/localhost/LocalHost` on the command line, the translator used
composition `LocalHost` for the environment. That composition bound the print
protocol to the implementation `ConsolePrint` with this statement:

     pollen.printProtocol := ConsolePrint    // bind the print protocol 

If this binding were not present, the print statements would all be no-ops.

A print implementation can also be selected on the command line using the option `-p`. 

    pollenc   -o out -t localhost-gcc -b @pollen-core  \
        -b @environments -e @environments/localhost/LocalHost \
        -p MyPrint \    
        MyTest.p   

Here `MyPrint.p` is a local implementation of print for test `MyTest.p`. 


