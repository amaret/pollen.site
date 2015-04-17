<h1 id="arrays" class="page-header">
Control Flow
</h1>

<p class="lead">
Control flow statements support looping, branching and decision making logic
which select the blocks of code to execute. </p>

Pollen control flow statements will
be familar to programmers who know C, C++, Java, Javascript, PHP, etc.

<h3 class="page-header"
id="ref-control-loops">
Loops
</h3>

<h4 class="page-header"
id="ref-control-for">
For Loops
</h4>

    for (uint8 i = 0; i < 10; i++) {
      ...
    }

These forms are also valid:

    for (;;)                 { !-- an infinite loop --! }
    for (j = 0; j < 10; j++) { !-- j has a default type of uint32 --!  }

<h4 class="page-header"
id="ref-control-while">
While Loops
</h4>

    while (x < 10) {
      x++
    }

<h4 class="page-header"
id="ref-control-dowhile">
Do-While
</h4>

    do {
      x++
    } while (x < 10)

This form is also valid:

    do {
      !-- 
          infinite loop. 
          note: terminating ';' is required. 
      --!
    } while;

<h3 class="page-header"
id="ref-control-conditional">
Conditional Statements
</h3>

The decision making statements include `if` and `switch`. 

<h4 class="page-header"
id="ref-control-if">
If
</h4>

    if (x < 10) {
      x++
    }

<h4 class="page-header"
id="ref-control-ifelse">
If - Else
</h4>

    if (x < 10) { 
      x++
    } else {
      x--
    }

<h4 class="page-header"
id="ref-control-ifelif">
If - Elif
</h4>

    if (x < 10) { 
      x++
    } elif (x < 20) {
      x++
    } else {
      x = 0
    }

A final `else` block is not required.

    if (x < 10) { 
      x++
    } elif (x < 20) {
      x++
    }


<h4 class="page-header"
id="ref-control-switch">
Switch
</h4>

    switch (x) {

      case 0: 
        break

      case 1:
        break

      default:
        break

    }

<h3 class="page-header"
id="ref-control-xfer">
Control Transfer Statements
</h3>

Control transfer statements in Pollen include `break`, `continue`, and `return`. 

<h4 class="page-header"
id="ref-control-continue">
Continue
</h4>

The `continue` statement skips the rest of the current iteration of a loop. 


    for(x = 0; x < 100; x++) {

      if (valueInRange()) {
        continue
      }

      ...
    }
    

<h4 class="page-header"
id="ref-control-break">
Break
</h4>

##### Break in a Loop Statement

The `break` statement exits any containing loops. 

    do {

      if (valueOutOfRange()) {
        break
      }

      ...
    } while;

##### Break in a Switch Statement

The `break` statement exits the `switch` statement. See <a href="#ref-control-switch">switch statement above</a> for example.

<h4 class="page-header"
id="ref-control-rtn">
Return
</h4>

The `return` statement terminates the execution of the currently executing function and returns control to the caller. 

    return
