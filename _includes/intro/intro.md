<h1 id="intro" class="page-header" style="margin-top: 20px">Overview</h1>

Pollen is our internal tool. We designed and developed Pollen to enable the rapid
expression and effective development of our own product ideas. While it has plenty of room to grow, in its
current version we find it to be a fun and expressive tool to work with. 

We are sharing Pollen in the hopes that
it will enable a more widespread expression of innovative ideas in
the area of hardware applications and embedded systems. We want it to enable orders of magnitude more people to efficiently go from hardware idea to prototype implementation to product deployment.

The syntax is clear and clean. If you are an artist, designer or student, 
or if you are an experienced engineer or researcher, we invite you to try it out, 
develop with it, and let us know what you think. 

<div class="alert alert-success" role="alert">
  <span class="glyphicon glyphicon-leaf"></span> 
  Pollen is <a style="color: #3c763d;" href="https://github.com/amaret/pollen/" target="_">open-source software</a>. 
</div>

<!-- ABOUT SECTION -->

<h2 id="about" class="page-header" style="margin-top: 20px">What is Pollen?</h2>

Pollen is a domain specific language for resource-constrained embedded systems programming.
In this domain the specification and configuration of target hardware can
vary widely, even drastically.  One system may have only dozens of <i>bytes</i> of RAM while another has hundreds of kilobytes. Timers, GPIOs, and on-chip or on-board peripherals will provide strikingly variable hardware profiles. Hardware configurations change during development and certainly during the lifecycle of a product. How to write reusable code for these targets? How to lessen the impact on code given variations and ongoing change in hardware configurations and capabilities? 

Pollen addresses these problems.  Its development has
been guided by the values of clarity, simplicity, and sound design
principles. It is meant be efficient for the developer, the lifecycle of product development and for the hardware itself. As a result Pollen provides a new experience for embedded systems programming. 

Pollen was designed for hardware applications that are reactive, asynchronous, and sensitive to consumption of time, space and energy resources. While Pollen will run on any hardware for which a C compiler exists, it was created for microcontrollers that tend to have bytes or kilobytes of RAM, just a few megahertz of processing power and typically cannot run operating systems such as Linux, Android or iOS. 

Below we connect the fundamental design concepts of Pollen to specific Pollen features.

<div class="alert alert-info" role="alert">
  <span class="glyphicon glyphicon-leaf"></span> 
  There is academic research behind Pollen. You can find it <a href="https://www.cs.ucsb.edu/research/tech-reports/2010-24" target="_" style="color: #31708f;">here</a>.
</div>

<div style="padding: 20px 20px;
">
  <img src="{{site.url}}/pollen/static/img/PollenConcepts.jpg" width="700" alt="Pollen Rationale Flower" />
</div>

<div class="container-fluid">
  <div class="row" style="padding: 10px 0;">
    <div class="col-sm-4">
      <label>Modularity</label>
        <ul>
          <li><a href="{{site.url}}/pollen/guide/modules">Modules</a></li>
          <li><a href="{{site.url}}/pollen/guide/classes">Classes</a></li>
        </ul>
    </div>
    <div class="col-sm-4">
      <label>Abstraction</label>
        <ul>
          <li><a href="{{site.url}}/pollen/guide/protocols">Protocols</a></li>
          <li><a href="{{site.url}}/pollen/guide/meta/#ref-meta-typeparm">Meta Types (type parameters)</a></li>
        </ul>
    </div>
    <div class="col-sm-4">
      <label>Portability</label>
        <ul>
          <li><a href="{{site.url}}/pollen/guide/modules">Modules</a></li>
          <li><a href="{{site.url}}/pollen/guide/c-code">Translation to C</a></li>
        </ul>
      </td>
    </div>
  </div>
  <div class="row" style="padding: 10px 0;">
    <div class="col-sm-4">
      <label>Efficiency</label>
        <ul>
          <li><a href="{{site.url}}/pollen/guide/c-code">Translation to C</a></li>
          <li><a href="{{site.url}}/pollen/guide/host-initialization">Host Initialization</a></li>
        </ul>
    </div>
    <div class="col-sm-4">
      <label>Hardware / Software Variability</label>
        <ul>
          <li><a href="{{site.url}}/pollen/guide/compositions">Compositions</a></li>
          <li><a href="{{site.url}}/pollen/guide/protocols">The Proxy Pattern</a></li>
          <li><a href="{{site.url}}/pollen/guide/host-initialization">Host Initialization</a></li>
          <li><a href="{{site.url}}/pollen/guide/host-initialization#ref-preset">The Preset Initializer</a></li>
        </ul>
    </div>
    <div class="col-sm-4">
      <label>Reusablity</label>
        <ul>
          <li><a href="{{site.url}}/pollen/guide/classes">Classes</a></li>
          <li><a href="{{site.url}}/pollen/guide/protocols">The Proxy Pattern</a></li>
          <li><a href="{{site.url}}/pollen/guide/meta/#ref-meta-valueparm">Meta Types (value parameters)</a></li>
        </ul>
    </div>
  </div>
  <div class="row" style="padding: 10px 0;">
    <div class="col-sm-4">
      <label>Configurability</label>
        <ul>
          <li><a href="{{site.url}}/pollen/guide/compositions">Compositions</a></li>
          <li><a href="{{site.url}}/pollen/guide/host-initialization">Host Initialization</a></li>
          <li><a href="{{site.url}}/pollen/guide/host-initialization#ref-preset">The Preset Initializer</a></li>
          <li><a href="{{site.url}}/pollen/guide/function-references#ref-funrefs-generic">Function References</a></li>
          <li><a href="{{site.url}}/pollen/guide/meta/#ref-meta-valueparm">Meta Types (value parameters)</a></li>
        </ul>
    </div>
    <div class="col-sm-4">
      <label>Support for Existing Code</label>
        <ul>
          <li><a href="{{site.url}}/pollen/guide/c-code">Translation to C</a></li>
          <li><a href="{{site.url}}/pollen/guide/c-code">C Code Injection</a></li>
        </ul>
    </div>
  </div>
</div>

<!-- TRY IT SECTION -->

<h2 id="tryit" class="page-header">Try it!</h2>

The easiest way to build Pollen code is using our command-line client that builds code in the cloud. Binaries for various microcontroller targets can be built that way. The other way is to check out the code and set up your system for local builds. 

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


