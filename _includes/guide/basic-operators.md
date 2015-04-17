<h1 id="operators" class="page-header">Operators</h1>

<p class="lead"> Operators perform operations on variables and return a
result.</p>

Pollen has the standard set of arithmetic and logical operators (shared
with C) and adds a few assignment operators of its own.

<table class="table table-striped table-bordered">

  <tbody>
    <tr>
      <th>Category</th>
      <th>Operators</th>
    </tr>

    <tr>
      <td>Arithemetic</td>
      <td><code>+</code> <code>-</code> <code>*</code> <code>/</code> <code>%</code></td>
    </tr>
    <tr>
      <td>Relational</td>
      <td><code>&gt;</code> <code>&gt;=</code> <code>&lt;</code> <code>&lt;=</code> <code>==</code> <code>!=</code> <code>&amp;&amp;</code> <code>||</code></td>
    </tr>
    <tr>
      <td>Increment and Decrement</td>
      <td><code>++</code> <code>--</code></td>
    </tr>
      <tr>
        <td>Bitwise</td>
        <td><code>&amp;</code> <code>|</code> <code>^</code></td>
    </tr>
    <tr>
      <td>Assignment</td>
      <td><code>=</code> <code>+=</code> <code>-=</code> <code>*=</code> <code>/=</code> <code>%=</code> <code>&amp;=</code> <code>^=</code> <code>|=</code> <code>&lt;&lt;=</code> <code>&gt;&gt;=</code> <code>:=</code> <code>@=</code></td>
    </tr>
    <tr>
      <td>Ternary</td>
      <td><code>? :</code></td>
    </tr>
  </tbody>
</table>

#### Binding Operator

The first Pollen specific assignment operator is `:=`. It is used to bind a
protocol member to a module which implements the protocol. It is called the
*binding operator*. 
More information on the binding operator can be found
<a href="{{site.url}}/pollen/guide/protocols#ref-protocol-binding-op">here</a>.

    GlobalInterruptsProtocol GI := Mcu.GlobalInterrupts       // bind a protocol member 

#### Pegging Operator

The second unique Pollen assignment operator is `@=` and this is used to
*peg* class references to byte arrays. This allows allocating a target
class object by overlaying its definition onto an index of a byte
array. The byte array at that index must contain a valid instance of
the class object. It is called the *pegging operator*.
More information on the pegging operator can be found
<a href="{{site.url}}/pollen/guide/arrays#ref-arrays-nodim">here</a>.

    Class1 cref @= array1                // peg object to array

<h2 class="page-header"
id="ref-op-precedence">
Operator Precedence 
</h2>

Pollen has the same operator precedence as C / C++ / Java / Javascript etc. Here is a
table of operator precedence. Operators with higher precedence are
evaluated before operators with relatively lower precedence. Operators
on the same line have equal precedence. When operators of equal
precedence appear in the same expression, a rule must govern which is
evaluated first. All binary operators except for the assignment
operators are evaluated from left to right; assignment operators are
evaluated right to left.


<table class="table table-striped table-bordered">
  <tbody>
    <tr>
      <th>Operators</th>
      <th>Precedence</th>
    </tr>
    <tr>
      <td>Postfix</td>
      <td><code>expr++</code> <code>expr--</code></td>
    </tr>
    <tr>
      <td>Unary</td>
      <td><code>++expr</code> <code>--expr</code> <code>+expr</code> <code>-expr</code> <code>~</code> <code>!</code></td>
    </tr>
    <tr>
      <td>Multiplicative</td>
      <td><code>*</code> <code>/</code> <code>%</code></td>
    </tr>
    <tr>
      <td>Additive</td>
      <td><code>+</code> <code>-</code></td>
    </tr>
    <tr>
      <td>Bit shift</td>
      <td><code>&lt;&lt;</code> <code>&gt;&gt;</code>
    </td>
    </tr>
    <tr>
      <td>Relational</td>
      <td><code>&lt;</code> <code>&gt;</code> <code>&lt;=</code> <code>&gt;=</code></td>
    </tr>
    <tr>
      <td>Equality</td>
      <td><code>==</code> <code>!=</code></td>
    </tr>
    <tr>
      <td>Bitwise AND</td>
      <td><code>&amp;</code></td>
    </tr>
    <tr>
      <td>Bitwise exclusive OR</td>
      <td><code>^</code></td>
    </tr>
    <tr>
      <td>Bitwise inclusive OR</td>
      <td><code>|</code></td>
    </tr>
    <tr>
      <td>Logical AND</td>
      <td><code>&amp;&amp;</code></td>
    </tr>
    <tr>
      <td>Logical OR</td>
      <td><code>||</code></td>
    </tr>
    <tr>
      <td>Ternary</td>
      <td><code>? :</code></td>
    </tr>
    <tr>
      <td>Assignment</td>
      <td><code>=</code> <code>+=</code> <code>-=</code> <code>*=</code> <code>/=</code> <code>%=</code> <code>&amp;=</code> <code>^=</code> <code>|=</code> <code>&lt;&lt;=</code> <code>&gt;&gt;=</code> <code>@=</code> <code>:=</code></td>
    </tr>
  </tbody>
</table>  

