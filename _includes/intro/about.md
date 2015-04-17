<h2 id="about" class="page-header" style="margin-top: 20px">About</h2>

Pollen is a domain specific language for embedded systems programming.
In this domain the specification and configuration of target hardware can
vary widely, even drastically.  One system may have only dozens of bytes of RAM and 
while another has hundreds of KB. Timers, GPIO, peripherals will provide strikingly
variable hardware profiles. How to write reusable code for these targets? 
How to lessen code exposure to variable configuration and ongoing change in hardware
specifications and capabilities? 

Pollen addresses these problems.  Its development has
been guided by the values of clarity, visual simplicity, and sound design
principles. As a result Pollen provides a new experience for embedded systems programming. 

Below we connect the fundamental design concepts of Pollen to specific Pollen features.

![Pollen graphic]({{ site.url }}/pollen/assets/PollenFleur.jpg)
 
<div class="container-fluid">
  <div class="row">
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
  <div class="row">
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
  <div class="row">
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

