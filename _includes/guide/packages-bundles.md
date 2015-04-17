
<h1 id="packages" class="page-header">Packages, Bundles, and Import</h1>

<p class="lead">The Pollen translator is invoked with a top level unit and a set of bundles.</p>

A bundle is a named directory which contains a collection
of packages. 
Pollen has a two directory structure where the root is the bundle and
the child is the package.
For example Pollen has some supplied bundes that contain core 
functionality. One of these is `pollen-core`. This bundle contains the following
packages:

     pollen.data     pollen.hardware pollen.output   pollen.pwm      pollen.time
     pollen.event    pollen.math     pollen.parts    pollen.text     pollen.utils

The package `pollen.event` contains Pollen code which supports events:

     Event.p  EventQueue.p   HandlerProtocol.p Newsroom.p 

The `.p` suffix identifies a Pollen source file. 

Packages contain Pollen types such as modules, compositions, protocols, classes and enumerations. 

The Pollen translator is called with a top level module and a set of bundles.
When given a bundle, the translator will handle it as a collection and process all the contained packages. 

The top level module uses the import statement to import the units it
needs. These units must be found in the set of bundles supplied to the
Pollen translator.


Users can code their own bundles for their applications. In addition a set of bundles is provided with Pollen which implements commonly used functionality. One of these provided bundles is called `pollen-core`. It contains a set of useful packages for timers, events, printing, and more. 

<h2 class="page-header"
id="ref-package">
The Package Statement
</h2>

A Pollen program can begin with a package statement. For example, class `Event`
begins with the statement `package pollen.event`. If the package statement is
not present the directory name of the pollen file is used as the default package. 

The package statement is documentary and does not change code generation.

    
<h2 class="page-header"
id="ref-import">
The Import Statement
</h2>

The import statement can appear in classes, modules, protocols, and
compositions. Classes, modules, protocols, and compositions can import classes,
modules, compositions, protocols, and enums. This is the simple form of the import:

     import Cpu

The import statement has an optional `from` clause and an optional `as` clause.

     from distro.ti.launchpad import Board  // 'from' specifies a package 
     from Board import Pin as MyPin         // 'from' specifies a composition 

<ul>
<li>The <code>from</code> clause can specify either a package or a composition. 
<ul>
<li>If not present, the type must be found in the package of the unit containing the import.
</li>
<li>If importing a module <code>from</code> a composition, that module must have
been exported by the composition using the export statement.</li>
</ul>
</li>
<li>The <code>as</code> clause specifies the local name for the type.</li>
</ul>

Packages cannot be imported. 

<h2 class="page-header"
id="ref-invoke-bundles">
Invoking the Pollen Cloud Compiler with Bundles
</h2>

Here is an invocation of the Pollen cloud compiler that supplies several bundles
(`pollen-core`, `localhost`, `environments`). 

    pollenc -o <output path> -t localhost-gcc \
        -b @pollen-core  -b @localhost   -b @environments  \
        -e @environments/localhost/LocalHost TimerBlink.p

A `-b` option to Pollen must precede each bundle path. Bundles can be sourced locally or they can reside in the cloud with the Pollen translator.  (The cloud bundles are those which are provided with Pollen.) Cloud bundles are specified with an `@` preceding the bundle name. In the example above `@pollen-core` specifies the `pollen-core` bundle in the cloud.  Note that the cloud bundles can be downloaded if you wish to customize or examine them, so they can be sourced locally if you wish.  

When given a bundle, Pollen will handle it as a collection and process all the contained packages. Pollen attempts to satisfy the names supplied in the import statement with the types contained in the bundle. 
