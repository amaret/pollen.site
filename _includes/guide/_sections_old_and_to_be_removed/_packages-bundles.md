
How to Use Packages, Bundles, and the Import Statement
===============================

The Bundle Package Directory Structure
--------------------------------

A bundle is a named directory which contains a collection of packages.  Packages are directories containing Pollen types such as modules, compositions, protocols, and classes.

Users can code their own bundles for their applications. In addition a set of bundles is provided with Pollen which implements commonly used functionality. One of these provided bundles is called `pollen-core`. It contains a set of useful packages for timers, events, printing, and more. 

Invoking the Pollen Translator with Bundles
------------------------------- 

Here is an invocation of the Pollen cloud compiler that supplies `pollen-core` as a bundle. 

    pollenc.py -o <output path> -t localhost-gcc -b @pollen-core  -b @localhost   -b @environments  \
                   -e @environments/localhost/LocalHost TimerBlink.p

(This example comes from the `Getting Started` section. For more details on it and on Pollen cloud compiler options see that section.)

A `-b` option to Pollen must precede each bundle path. Bundles can be sourced locally or they can reside in the cloud with the Pollen translator.  (The cloud bundles are those which are provided with Pollen.) Cloud bundles are specified with an `@` preceding the bundle name. In the example above `@pollen-core` specifies the `pollen-core` bundle in the cloud.  Note that the cloud bundles can be downloaded if you wish to customize or examine them, so they can be sourced locally if you wish.  

When given a bundle, Pollen will handle it as a collection and process all the contained packages. Pollen attempts to satisfy the names supplied in the import statement with the types contained in the bundle. 

How to Use the Import Statement
----------------

In the import statement you can specify a package name in the from clause. 

The package `pollen-core` contains an event bundle called `pollen.event`.  In `pollen.event` a number of types are defined to support event handling. Among these are two types, a class `Event.p` and a protocol `HandlerProtocol.p`. Here is how you import these types using the import statement:

   from pollen.event import Event 
   from pollen.event import HandlerProtocol as HP

The `as` clause in the import statment specifies a local name for the type. It is optional. 

The `from` clause in the import statement specifies which bundle  contains the requested type. It is not required if the requested type can be found in the same directory as the top level module. The directory of the top level module functions as a default package. If your application defines a `MyLed.p` file in the directory of the top level module, it could be imported from that directory (as the default package) without specifying a `from` clause:

   import MyLed

How to Use the Import Statement for Meta Type Instantiation
----------------

A meta type instantiation creates a new type. The parameters that instantiate the meta type are passed on the import statement. 

Here is `LedMeta`, a meta type in the `pollen-core` cloud bundle:

    meta {bool activeLow}         // activeLow is a meta parameter

    module LedMeta {              // LedMeta is a meta type
        ....
    }

When `LedMeta` is imported into a unit, a value for the parameter must be available. Such an import is called a meta instantiation:

    import LedMeta{true} as Led   // a meta instantiation.

Meta types are a more advanced feature of Pollen and the topic is explored in depth in the section on meta types. This example is supplied to provide a complete overview of the import statement.

How to Use the Package Statement
----------------

A Pollen program can begin with a package statement. For example, class `Event` can begin with the statement `package pollen.event`. If the package statement is not present the directory name of the pollen file is used as the package. The package statement is documentary and does not change code generation.

