<h2 id="tryit" class="page-header">Try it!</h2>

Pollen code is built in the cloud using a command-line client and can build
binaries for various microcontroller targets.

Here is a small Pollen program that uses the timer implementation and toggles an
Led when the timer ticks. This program also uses the event and led modules in
the cloud. Copy this file and paste it into a file named `TimerBlink.p` to try
running the Pollen cloud compiler.

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

The Pollen translator command line shown below will translate this file for the arduino. 

Here are descriptions of the options used:

- `-e` is the option to specify an environment. 
- `-b` is the option for bundles. In this case cloud bundles are used which is
  signified by `@` before the bundle name.
- `-t` is the option for the toolchain. 
- `--mcu` is the option for target microcontroller. 
- `-o` option specifies the path to the output file. 

The C compiler output file will have the name TimerBlink-prog.out (or <top level module name>-prog.out in the general case). Note that other tools may run on that file (e.g. objcopy) so what the final executeable name will be depends on the toolchain used. 

    pollenc                            \
        -o <output path>               \
        -t avr-gcc                     \
        --mcu atmega328p               \
        -b @pollen-core                \
        -b @atmel                      \
        -b @environments               \
        -e @environments/arduino/Uno   \
        TimerBlink.p
    
The option `-h` will list the options to the cloud compiler.

This invocation is for the `atmega328p` target and uses the `avr-gcc` toolchain. You
can translate this for the your local machine (the `localhost-gcc` toolchain) and run it there to verify the
execution flow. Note that a `localhost-gcc` toolchain will translate the Pollen
application but not link it whereas `avr-gcc` toolchain will translate and link the
application, producing an executable that is downloaded to you. 
