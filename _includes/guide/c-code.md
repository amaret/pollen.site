<h1 id="arrays" class="page-header">Compatibility with C</h1>

<p class="lead">Pollen is a compiled language via C. Pollen code is translated to C and as a result Pollen can run on any platform which has a C compiler.</p>

This has significant advantages: viability on all platforms, mature compilers, being able to use C debuggers, being able to link with C libraries, and so on. But in addition Pollen offers a deeper and more flexible integration with C through a feature called *code injection*.

<h2 class="page-header"
id="ref-ccode-inj">
C Code Injection
</h2>

A code injection block is initiated by `+{` and ends with a matching `}+`. The code between these markers is C code. Code injection blocks can be used to include C header files, functions, declarations, statements, and even expressions in Pollen programs. This flexibility makes it very easy to reuse existing C code in a Pollen program. The simplest example of code injection is simply to include a C header file in the Pollen program: 

    +{ #include <avr/interrupt.h> }+

This degree of support for integration with C makes it easy to access the benefits of Pollen in any context where C is used, which includes virtually all embedded software development shops.

In addition there is sometimes a need to substitute Pollen names into the C scope. That is, Pollen identifiers can be used in code injection blocks (they must be surrounded by back ticks). The example below shows how this works for meta value parameters and also Pollen names.

    package atmel.atmega8
    from pollen.hardware import InterruptSource
    from pollen.hardware import InterruptHandler

    +{ #include <avr/interrupt.h> }+

    meta { string name, 
           string enableRegister, 
           string enableBit, 
           string clearRegister, 
           string clearBit }

    module MetaInterrupt implements InterruptSource {

      InterruptHandler.isr() handler 

      +{ 
        ISR( `name` ) {          //name is a meta parameter. 
          (`handler`)();          // handler is a local variable. 
        } 
      }+

      public host setHandlerOnHost(InterruptHandler.isr h) {
        handler = h 
      }

      public enable() {
        +{`enableRegister`}+ |= (1 << +{`enableBit`}+) // meta parameters in injected code. 
      }
      ...
    }
