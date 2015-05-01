<!-- TRY IT SECTION -->

<h1 id="tryit" class="page-header">Try it!</h1>

<p class="lead">You can build Pollen code in the cloud or set up a local build environment.</p>

<h2>Building in the cloud</h2>

<h4>Install the pollen client</h4> 

    pip install pollen

<h4>Copy and paste this code into a file named Blink.p</h4>

    import pollen.environment as MyBoard
    from MyBoard import Led

    from pollen.time import Timer

    module Blink {

      host new Timer t1(tick)

      tick() {
        Led.toggle()
      }

      pollen.run() {
        t1.start(500, true)
        MyBoard.Newsroom.run()
      }
    }

<h4>Build the code</h4>

The cloud compiler can build for multiple microcontroller targets, we've put together support for a few microcontrollers in pollen, and the core pollen library is portable. 

 Below you may find a conyou your application contsits of the all the active and configurable hardware components your application has access to. It is easy to write code with Pollen that will build and run on different hardware, out of the box. 

<ul id="targetsTab" class="nav nav-tabs" role="tablist">

  <li role="presentation" class="dropdown active">
    <a href="#silabs" id="silabs-tab" data-toggle="dropdown" aria-controls="silabsTabDrop-contents" aria-expanded="false">Silicon Labs <span class="caret"></span></a>
    <ul class="dropdown-menu" role="menu" aria-labelledby="silabsTabDrop" id="silabsTabDrop-contents">
      <li class=""><a href="#efm32zg" tabindex="-1" role="tab" id="efm32zg-tab" data-toggle="tab" aria-controls="efm32zg" aria-expanded="false">efm32zg</a></li>
      <li class=""><a href="#efm32g" tabindex="-1" role="tab" id="efm32g-tab" data-toggle="tab" aria-controls="efm32g" aria-expanded="false">efm32g</a></li>
    </ul>
  </li>

  <li role="presentation" class=""><a href="#atmel" role="tab" id="atmel-tab" data-toggle="tab" aria-controls="atmel" aria-expanded="false">Atmel</a></li>


  <li role="presentation" class="dropdown">
    <a href="#ti" id="ti-tab" class="dropdown-toggle" data-toggle="dropdown" aria-controls="ti-tab-contents" aria-expanded="false">Texas Instruments <span class="caret"></span></a>
    <ul class="dropdown-menu" role="menu" aria-labelledby="ti-tab" id="ti-tab-contents">
      <li class=""><a href="#msp430-1" tabindex="-1" role="tab" id="dropdown1-tab" data-toggle="tab" aria-controls="dropdown1" aria-expanded="false">MSP430xyz</a></li>
      <li class=""><a href="#msp430-2" tabindex="-1" role="tab" id="dropdown2-tab" data-toggle="tab" aria-controls="dropdown2" aria-expanded="false">MSP430xyz</a></li>
    </ul>
  </li>

  <li role="presentation" class=""><a href="#localhost" role="tab" id="localhost-tab" data-toggle="tab" aria-controls="localhost" aria-expanded="false">Localhost</a></li>

</ul>

<div id="targetsTabContent" class="tab-content">

  <div role="tabpanel" class="tab-pane fade active in" id="efm32zg" aria-labelledby="efm32zg-tab">
    <p>EFM32 Zero Gecko Targets</p>
    <pre class="">pollen build -t efm32-gcc -m EFM32ZG108F32 -e @silabs/devkit/EFM32ZG.p -b @pollen-core -b @silabs -cb @silabs ./Blink.p</pre>
  </div>
  <div role="tabpanel" class="tab-pane fade" id="efm32g" aria-labelledby="efm32g-tab">
    <p>EFM32 Gecko Targets</p>
    <pre class="">Gecko build descriptiond here.</pre>
  </div>

  <div role="tabpanel" class="tab-pane fade" id="atmel" aria-labelledby="atmel-tab">
    <p>Atmel build description here</p>
  </div>
  <div role="tabpanel" class="tab-pane fade" id="dropdown1" aria-labelledby="dropdown1-tab">
    <p>Msp430 build description here.. launchpad I think.</p>
  </div>
  <div role="tabpanel" class="tab-pane fade" id="dropdown2" aria-labelledby="dropdown2-tab">
    <p>Potentially a differet target here.</p>
  </div>

  <div role="tabpanel" class="tab-pane fade" id="localhost" aria-labelledby="localhost-tab">
    <p>Localhost build</p>
    <pre class="">pollen build -t localhost-gcc -e ./bundles/environments/localhost/LocalHost.p -b @pollen-core -b @localhost ./Blink.p </pre>
  </div>


</div>

<!-- 

<h2>Setting up a local build environment</h2>

<h4>Install the wuitl tool</h4> 

-->

