<h1 id="tour" class="page-header">A Tour of Pollen</h1>

Common practice suggests that the first program in a new language should print the words “Hello, world!” on the screen. In the world of hardware applications where not every device has a screen, the equivalent is to blink an LED. A blink program in Pollen looks like this: 

    import pollen.environment as App
    from App import Led

    from pollen.time import Timer

    module HelloWorld {

      host Timer blinkTimer = new Timer(blink)

      blink() {
        Led.toggle()
      }

      pollen.run() {
        blinkTimer.start(250)
        App.run()
      }

    }

This simple program shows some important elements of Pollen. Modules are the most
fundamental type in Pollen.  A module can be thought of as a singleton class. 
Our Pollen `HelloWorld` is a module. It declares
data and functions, and calls functions. The `pollen.run()` function is special in
that it is the entry point (like `main()` in C). Only one `pollen.run()`
function can be present in the Pollen source presented to the Pollen translator. 
The module that defines this `pollen.run()` function is
called the top level module.

The translator is called with one top level module and a set of bundles.
The top level module uses the import statement to import any types it needs.
These types must be found in the bundles supplied to the Pollen translator.

Note that this `HelloWorld` program does not contain any details of the target
hardware. Pollen enables software abstraction so that a Pollen program can run
with no or minimal change on multiple targets. 




