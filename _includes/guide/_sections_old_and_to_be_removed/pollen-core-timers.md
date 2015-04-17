
How to Use Timers
=================

The Pollen cloud bundles in `pollen-core` contain some definitions of fundamental and useful types for embedded programming. There are two classes for timers in package `pollen.time`. The `TimerManager` class handles administration and registration of timers. It is usually not necessary for a timer client to access this class. Timer clients can use the timer subsystem via the `Timer` class. 

Here is a simple example that allocates a `Timer` with a handler and starts it. When the timer ticks, the code toggles an led.  

    import pollen.environment as Env
    from Env import Led
    
    from pollen.time import Timer
    
    module TimerBlink {
    
      host new Timer t1(tick)    // Declare and allocate a Timer with a tick() handler
    
      tick() {
        Led.toggle()
      }
    
      pollen.run() {
        t1.start(500, true)      // Start the timer
        Env.Newsroom.run()
      }
    }

The `Timer` class is located in the `pollen-core` bundle and you can download it. It is very simple to use. 

1. Define a handler for the timer. This handler will define what you want to happen when the timer ticks a specified number of times. In the code above the handler is `tick()`.

2. Declare and initialize a host `Timer`. In this example the host timer is called `t1` and it is initialized with `tick()` as its handler. 

3. Start the timer by calling `start()`. The first parameter specifies the timer interval in milliseconds and the second is a boolean which controls whether this interval will repeat. In this code the start method is called in `pollen.run()` which is the main entry function (like `main` in C). 

To stop the timer `stop()` can be called.

(The code above uses `Env.Newsroom()` to handle toggling an led. That will discussed in the section on using events.)

To translate this code an environment must be chosen. You can do this on the command line. There are environments that are available in the `pollen-core` cloud bundle or you can define your own. The `-e` option below selects the Arduino Uno environment. All the bundles specified below are cloud bundles as indicated by the `@` preceding the bundle name but you can define your own locally. (Or you can download and modify these). The `-t` option specifies the tool chain. This command line will invoke the avr-gcc compiler on the code.  

    pollenc.py 		                        \
        -o <output path>		            \
        -t avr-gcc --mcu atmega328p 		\
        -b @pollen-core 		            \
        -b @atmel 		                    \
        -b @environments 		            \
        -e @environments/arduino/Uno 		\
        TimerBlink.p
    
