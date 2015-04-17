
Getting Started with Pollen
==========

Pollen is available as a cloud compiler. You do not need to download it. 

The python script that runs the Pollen in the cloud is called `pollenc.py` and it can be downloaded from `WHERE?`.  To see all the options run `pollenc.py -h` in a terminal window. 

In this example we will show how to use Pollen with a simple example that uses a timer to blink an led. We will translate it for two targets: the Arduino Uno and local host.  In the other 'How To' sections we will be exploring a variety of aspects of this example application. We will look at the code itself and also the types it uses. In this section we will focus on how to use the cloud compiler. 

Here is the blink application. Copy and paste it locally into a file `TimerBlink.p`:

    import pollen.environment as Env
    from Env import Led
  
    from pollen.time import Timer
  
    module TimerBlink {
  
      host new Timer t1(tick)    // Declare and allocate a timer with a tick() handler
    
      tick() {
        Led.toggle()            // Toggle (blink) an Led
      }
    
      pollen.run() {
        t1.start(500, true)      // Start the timer
        Env.Newsroom.run()
      }
  }


The Pollen translator is invoked with a top level module, options, and a set of bundles.  The top level module is the file that contains the entry point `pollen.run()` (this is the main entry, like `main()` in C) and it is supplied last on the command line.  That means in our example `TimerBlink.p` should appear last on the command line. 

When given a bundle, the translator will handle it as a collection and process all the contained packages.  A bundle is a named directory which contains a collection of packages.  Packages are directories containing Pollen types.

The top level module uses the import statement to import the units it needs. These units must be found in the set of bundles supplied to the Pollen translator. In our `TimerBlink` example `Timer` and `Led` are imported.

Cloud compiler output consists of messages and files. The Pollen translator checks the code and translates it to C if there are no Pollen errors, then the appropriate C compiler runs (in the cloud). If there are no errors the code will be linked and downloaded. Depending on the target there may be other tools run on the output (for example, objcopy). 

Here is the command line to translate this Pollen file into C for the Arduino Uno. You must supply a local directory path for <output path>.

    pollenc.py                            \
      -o <output path>                    \    
      -t avr-gcc                          \
      -m atmega328p                       \
      -b @pollen-core                     \
      -b @atmel                           \
      -b @environments                    \
      -e @environments/arduino/Uno        \
      TimerBlink.p                        \

(Note the most current list of supported options are available as the output of `pollen.py --help`.)

The `-o` (or `--out`) option specifies the local path to the output files.

The `-t` (or `--toolchain`) option specifies the toolchain. Current supported toolchains include avr-gcc,
arm-none-eabi-gcc, and localhost-gcc. The toolchain includes the compiler but may also incorporate other tools (such as avrdude and objcopy).

The option `-m` (or `--mcu`) option specifies the target microcontroller. Valid values for this option depend on the toolchain. (Note that if the toolchain is `localhost-gcc` this option is not supported.)

The option `-b` (or `--bundle`) specificies a bundle. In this case cloud bundles are used which is signified by `@` before the bundle name. These bundles reside in the cloud and support a variety of essential types, services, and hardware. Cloud bundles can be downloaded for inspection or modification. 

The option `-e` (or `--environment`) is the option to specify an environment. For more information on this option see the 'How To' section on specifying `pollen.environment`.

The C compiler output file will have the name TimerBlink-prog.out (or <top level module name>-prog.out in the general case). It will be located under the output directory specified with `-o`.

Note that other tools may run on that file (e.g. objcopy) so  what the final executeable name will be depends on the toolchain used.

Here is the cloud compiler command line to translate the `TimerBlink` program for the localhost:

    pollenc.py -o <output path> -t localhost-gcc -b @pollen-core  -b @localhost   -b @environments  \ 
               -e @environments/localhost/LocalHost TimerBlink.p

The values for the `-t` and `-e` options have changed and the `-m] option is not supplied (because it is not meaningful in the localhost context). 

Find the file TimerBlink-prog.out in the output directory and then run this file on your local host.  This file will produce the following output:

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

This is simply printing out a trace of called routines. Translating your Pollen application for the target localhost can provide a useful verification step before you download and run your application on target hardware.  One thing that is happening here is that the Pollen print statement is mapped to local host print functionality. This will be explored in detail in the section on how to use the Pollen print statement.

