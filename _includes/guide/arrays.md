<h1 id="arrays" class="page-header">Arrays</h1>

<p class="lead">Arrays in Pollen can be declared with elements of primitive type, class type, and function reference type.</p>

<h2 class="page-header"
id="ref-arrays-creation">
Creation and Initialization 
</h2>


<h4 class="page-header"
id="ref-arrays-primitivetype">
Arrays of Primitive Type
</h4>

Here are several arrays of primitive type, showing explicit as well as default initialization.

    uint8 arr1[3]             // array of 3 uint8, by default each element initialized to 0.

    uint8 arr2[3] = {7}       // array of 3 uint8, each element initialized to 7.


The above arrays are target arrays. They will be initialized at load time. They must be initialized to constants, not variable values or function returns. 

A host array has the attribute `host`. Here is a host array. It will be initialized during the host phase:

    host uint8 [3] arr3 = {5,5,7}   // host array of 3 uint8, initialized to 5,5,7.

Host arrays have the ability to be initialized to host variable values or values returned by host
functions.

    host uint8 arr4[3]  = { myHostVar, getVarOnHost(), getVarOnHost() }   // host array init to host values

For all arrays the type of the array is on the left and is followed by the array name. The specification of the size can follow either the type or the name.


<div class="alert alert-info" role="alert">
  <span class="glyphicon glyphicon-eye-open"></span>
   Only single dimensional arrays are currently supported. Look for multi-dimensional arrays in the next release.
</div>


<h4 class="page-header"
id="ref-arrays-classtype">
Arrays of Class Type
</h4>

        host LedState ledStates[2] = { new LedState(127) }

This is a host array of two Led states. The `new LedState()` call will invoke the host constructor so the array is allocated and initialized to two LedState elements statically. Target arrays are supported; they differ by the abscence of the `host` attribute.

        LedState ledStates[3] = { null }        // initialized to 3 nulls

This target array is allocated and initialized to three null references to LedState objects at load time. Constructors cannot be called in target array initialization.


<h4 class="page-header"
id="ref-arrays-funrefs">
Arrays of Function References
</h4>

Arrays can have an element type which is a function reference. The element type can be
a module function reference. 


      Mod.foo(uint8) bar                  // A function reference to Mod.foo()
      host Mod.foo foos[3] = { bar }      // Array of references to Mod.foo()

The element type can also be a protocol function reference. This is useful
in supporting generic code as the protocol function can be implemented by
multiple functions with the same signature. Iterating over the array provides a
generic way of calling these multiple functions. `LedProtocol` is a protocol which
contains the function declaration `on()`. 

      LedProtocol.on onFunctions[3] = { Led1.on, Led2.on, Led3.on }

The function references in the array have now been initialized to the `on` functions in modules which
implement the `LedProtocol`. 

An example of generic code using arrays of function references is 
<a href="{{site.url}}/pollen/guide/function-references#ref-funrefs-generic">here</a>.
More information on function references is 
<a href="{{site.url}}/pollen/guide/function-references">here</a>.


<div class="alert alert-info" role="alert">
  <span class="glyphicon glyphicon-leaf"></span>
  Class function references are not supported.
</div>

<div class="alert alert-warning" role="alert">
  <span class="glyphicon glyphicon-eye-open"></span>
   A function reference cannot be initialized to a host function. 
</div>
    

<h4 class="page-header" id="ref-arrays-nodim">
Arrays Without Dimension and the Pegging Operator
</h4>

Arrays can be declared with no dimension at all. That is, there is no dimension
and also no initializer. Such arrays are not allocated
as arrays, they are array references. These kinds of references can be pegged (using the pegging operator `@=`) to other arrays at runtime. 
Only arrays declared without dimension can be pegged. A pegged array *overlays* in memory 
the array to which it was pegged.

        byte arrayNoDim[]    // no initializer!

Here is an array of characters:

        byte arrayString[] = { 'h', 'e', 'l', 'l', 'o' , ' ', 'm', 'a', 'r', 'y'}

The first array can be pegged to the second array and then accessed through it:

        arrayNoDim @= arrayString       // array pegging
        string str = arraryNoDim[6]
        print str                       // prints 'mary'

A `uint32` array can be pegged to a `uint8` (or `bool`, `int16`, etc.) array and vice versa. This is useful for
flexible memory access and it can also be used to obtain some of the functionality of a type cast as shown below. 

       uint8 u8[4] = {0,1,2,3}
       uint32 u32[] 
       bool   b[] 

       u32 @= u8        // access the source as an unsigned 32 bit
       b   @= u8        // access the source as a boolean

An array without dimension can also be pegged to a class reference, allowing
access to the object as if it were overlaid by an array.

<div class="alert alert-success" role="alert">
  <span class="glyphicon glyphicon-eye-open"></span>
   Only target arrays can be declared without dimension.
</div>

<div class="alert alert-info" role="alert"> 
  <span class="glyphicon glyphicon-eye-open"></span>
  Arrays without dimension can be used to obtain some typecast functionality and allow you to access the same memory via more than one name and type.
</div>

<h4 class="page-header"
id="ref-arrays-hostdim">
Arrays with Host Dimension
</h4>

Arrays can have dimensions specified by a host variable, as below:

    host uint8 numLeds = 1          // a host array dimension variable
    LedState states[numLeds] = {null}

The value of variable `numLeds` is computed during the host phase. Thus its value at load time will be known. This 
supports static allocation and initialization for arrays of computed size. Such
an array can adjust to changing requirements without changing source code. Also
static allocation avoids all the problems associated with dynamic memory
management. 

More information on host array initialization can be found <a href="{{site.url}}/pollen/guide/host-initialization#ref-hostdata-arrays-hostdim">here</a>.

<h2 class="page-header"
id="ref-arrays-access">
Accessing and Modifying an Array
</h2>

Array access uses the `[]` operator. 

      myVar = myArray[i]   // 'i' can be any unary expression

Assigning an array element is an ordinary assignment with the array element expression on the right hand side. 

      myArray[i] = newValue  

The type of the array element must be compatible with the type of the expression on the other side of the assignment operator. 

<h2 class="page-header"
id="ref-arrays-iter">
Iterating Over an Array
</h2>


The `for` and `while` statements can be used to iterate over an array. `strlen()`, the function shown below, can be found in the `pollen.text` package in the bundle `pollen.core`. 

      public uint16 strlen(string s) {
        byte b [] @= s
        uint16 i = 0
        while (b[i] != '\0') {   // look for the string terminator character
          i++
        }
        return i
      }

In the example below, `numLeds` is a host variable computed at host time. Its value will default to `1` if no host initialization assignment occurs.

    host uint8 numLeds = 1              // a host array dimension variable
    LedState states[numLeds] = {null}    
    
    for (uint8 i = 0; i < numLeds; i++) {
         // process led state element
    }

