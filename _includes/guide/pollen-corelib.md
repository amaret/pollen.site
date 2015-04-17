<h1 id="pollen-corelib" class="page-header">Core Library</h1>

<p class="lead">
The Pollen cloud bundles contain definitions of
fundamental and useful types for embedded programming, 
as well as some implementations for specific targets.
</p>

These bundles can be used as is in the cloud, or they can be downloaded,
modified, and used locally. They also provide examples of Pollen code. 

One useful bundle in the cloud is `pollen-core`.
Here is an an overview of the packages in that Pollen cloud bundle,
followed by a discussion of how to use events and timers. 

<div class="container-fluid">
  <div class="row">
    <div class="col-sm-4">
      <label>pollen.data</label>
        <ul>
          <li>Queue, List, HandlerQueue.</li>
        </ul>
    </div>
    <div class="col-sm-4">
      <label>pollen.event</label>
        <ul>
          <li>Event, EventQueue, HandlerProtocol, Newsroom.</li>
        </ul>
    </div>
    <div class="col-sm-4">
      <label>pollen.hardware</label>
        <ul>
          <li>protocols for Cpu, GlobalInterrupts, I2C, PinProtcol
          Led, LifeCycle, Memory, more.
          </li>
        </ul>
    </div>
  </div>
  <div class="row">
    <div class="col-sm-4">
      <label>pollen.math</label>
        <ul>
          <li>math functions.</li>
        </ul>
    </div>
    <div class="col-sm-4">
      <label>pollen.parts</label>
        <ul>
          <li>Button, Led meta types.</li>
        </ul>
    </div>
    <div class="col-sm-4">
      <label>pollen.output</label>
        <ul>
          <li>PrintProtocol.</li>
        </ul>
    </div>
  </div>
  <div class="row">
    <div class="col-sm-4">
      <label>pollen.text</label>
        <ul>
          <li>string functions.</li>
        </ul>
    </div>
    <div class="col-sm-4">
      <label>pollen.time</label>
        <ul>
          <li>Timer, TimerManager.</li>
        </ul>
    </div>
    <div class="col-sm-4">
      <label>pollen.utils</label>
        <ul>
          <li>ListManager.</li>
        </ul>
    </div>
  </div>
</div>


<div class="alert alert-success" role="alert">
  <span class="glyphicon glyphicon-leaf"></span>
  Core functionality will continue to be expanded in useful and exciting ways.
</div>
