<h1 id="strings" class="page-header" style="margin-top: 5px">Strings and Characters</h1>


<p class="lead">Pollen supports a string data type and string and character literals. </p>

Here is a string variable initialized to a string literal:

     string s = "my string"

Pollen strings translate to C strings and they are null terminated. 
Similar to C, a string in Pollen is actually a one-dimensional array of
bytes which is terminated by a null character '\0'. 

Pollen has a `byte` type which can be used for characters. Here is an example
which shows both `string` and `byte`. 

     public uint16 strlen(string s) {
         byte b [] @= s
         uint16 i = 0
     
         while (b[i] != '\0') {
           i++
         }
         return i
      }

This is the implementation of `strlen()` found in the `pollen.text` package in the `pollen-core` cloud bundle. An array of bytes is pegged to the string so that the string characters can be accessed as array elements.

Note that it is not safe to assume that the parameter `s` is writeable through
byte array `b`. The elements of a string are immutable if the string was allocated in read 
only memory (causing a bus error or other runtime failure on an attempt to modify it). 
String literals are allocated in read only memory so a string initialized to a string 
literal can not have its characters modified. The string as a whole may be reassigned to another string 
literal of course. 


Here is a byte array being initialized to character literals:

        byte arrStr[] = { 'h', 'e', 'l', 'l', 'o' , ' ', 'd', 'a', 'v', 'e'}

Using array pegging, a string can be assigned to the contents of this array. 

        arrNoDim @= arrStr       // array pegging
        string str = arrNoDim[6]
        arrNoDim[6] = 'D'
        print str                // prints 'Dave'

This string `str` can be modified through the array `arrNoDim`. Above we show a
letter being capitalized. This is possible because the memory for the byte array `arrStr` is allocated in RAM.

<div class="alert alert-warning" role="alert">
  <span class="glyphicon glyphicon-fire"></span>
  String characters can be modified via an array pegged to a string. 
  But only do this if the string is writeable!
</div>

