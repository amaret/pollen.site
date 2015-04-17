<h1 id="basics" class="page-header" style="margin-top: 5px">The Basics</h1>

<h3 id="ref-constsvars" class="page-header">Constants and Variables</h3>

Pollen is translated to C and it will often look like C, only simpler. 

Here are some typical declarations.

    uint8 i = 0
    bool flag = true
    int32 x, y, z
    string hello = "Hello world!"     // the quoted literal is terminated with '\0'

Pollen supports the attributes `const` and `volatile` for declarations. They
have the same meaning as they do in C.

<h3 id="ref-refs" class="page-header">References</h3>

Pollen data members can be references. 
Pollen does not support pointers. 
There are three kinds of references in Pollen. 

- Class references. More on these
<a href="{{site.url}}/pollen/guide/classes#ref-class-ref">here</a>.
- Function references. More on these
<a href="{{site.url}}/pollen/guide/function-references">here</a>.
- Protocol member. More on these
<a href="{{site.url}}/pollen/guide/protocols#ref-protocol-member">here</a>.

<h3 id="ref-comments" class="page-header">Comments</h3>

Pollen has several available formats for comments. Here are the single line formats:

     --- A comment.
     # Another comment.
     //  YAC. (Yet Another Comment.)

There is one format for multi-line comments:

     !--
       The first '!' must be followed by 2 or more dashes...
       ...and the last '!' must be preceded by 2 or more dashes.
     --!

<h3 id="ref-stmt-term" class="page-header">Statement Terminator</h3>

An expression becomes a statement when it is terminated by a statement
terminator. The statement terminator is a newline. For statements
on one line a semicolon can be used as terminator. Here, for example, two
class members are initialized to parameter values:

    @data = data; @priority = priority

This is equivalent to:

    @data = data
    @priority = priority

(The `@` indicates that this variable is defined in the body of a class or module. It is equivalent to `this` in Java/C++)

Pollen does not require explicit visible statement terminators. 
Using newline as a statement terminator makes programs visually simpler and more readable. 

<div class="alert alert-warning" role="alert">
<span class="glyphicon glyphicon-eye-open"></span>
Use newlines in natural places where they are commonly found in well-structured code.
</div>

Pollen is flexible and understands standard formats. Multiple newlines, possibly with embedded comments, are equivalent to a single statement terminator.

     uint8 buff[] = { 
                      0,1,2,
                      3,4,5
                    }
     uint8 buff[] = { 0,1,2,
                      3,4,5 }
     uint8 buff[] = { 0,1,2,3,4,5 }

Or, for functions:

     foo() {  }
     bar() { 
     }


<div class="alert alert-danger" role="alert">
<span class="glyphicon glyphicon-fire"></span>
It is important to remember that the newline is meaningful syntax and is not ignored.
</div>

Here is an example of non-conventional newline location that will cause a syntax error. 

     uint8 buff[] = { 0,1,2
                      ,
                      3,4,5,}


<h3 id="ref-integers" class="page-header">Integers</h3>

Pollen supports the signed integer types `int8`, `int16`,  and `int32` 
which map to an 8-bit signed integer, 16-bit signed integer, and 32-bit signed integer.

Pollen supports the unsigned integer types `uint8`, `uint16`, and `uint32` 
which map to an 8-bit unsigned integer, 16-bit unsigned integer, and 32-bit unsigned integer.

<div class="alert alert-info" role="alert">
<span class="glyphicon glyphicon-eye-open"></span>
Since Pollen is designed for microcontrollers with limited memories, it does not currently support signed or unsigned 64-bit integers.
</div>


<h3 id="ref-real" class="page-header">Real Numbers</h3>

Pollen supports the data type `real`. This is mapped to the C data type `float`.

     real f = 123e4

<h3 id="ref-numeric-lits" class="page-header">Numeric Literals</h3>

Integer literals can be written as:

- A decimal number, with no prefix
- An octal number, with a 0o prefix
- A hexadecimal number, with a 0x prefix

All of these integer literals have a decimal value of 17:

     decimalInteger = 17
     octalInteger = 0o21           // 17 in octal notation
     hexadecimalInteger = 0x11     // 17 in hexadecimal notation

Floating point literals use standard floating point notation.

     real f1 = 1.3
     real f2 = 0.0
     real f3 = 123e4
     real f4 = -7.5

<h3 id="ref-typecvt" class="page-header">Numeric Type Conversion</h3>

Pollen supports the same default (non-explicit) type conversions that C
supports. 

Pollen does not support type casting. The pegging operator can be used with
arrays to get the functional equivalent of casting. More on pegging arrays 
<a href="{{site.url}}/pollen/guide/arrays#ref-arrays-nodim">here</a>.

<h3 id="ref-bool" class="page-header">Booleans</h3>

Pollen supports the boolean type `bool`. It can be assigned to the constants
`true` or `false`. 

     bool flag = true

<h3 id="ref-asserts" class="page-header">Assertions</h3>

Pollen assertion are turned on by the cloud compiler option `-a`. They are off
by default.

Assertions consist of an expression followed by a string. If the expression is
true the string is printed out:

     pollen.assert(f1 == 3, "found f1 == 3")

Note that the string will not be printed if no print implemenation has been
bound. More on binding a print implementation can be found 
<a href="{{site.url}}/pollen/guide/print-keyword/#ref-print-bind">here</a>.

If assertions are not turned on, the assert will be a no-op.


