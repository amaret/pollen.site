<h1 id="arrays" class="page-header">Enumerations</h1>

<p class="lead">Pollen supports `enum` as a type that is a set of named
constants. </p>

An enum declaration contains only constant declarations and no functions or variable declarations. Each enum value is an unsigned 8 bit integer. 

An enum can be the only type in file or it can be nested within another type. Here is a non-nested enum. It is the only type contained in a file `FadeState.p`:

    enum FadeState { 
        NOFADE = 0, PULSEUP = 1, PULSEDOWN = 2, PULSEHOLD = 3, WHITE = 4, COLOR = 5
    }

All the named constants are public. Any client code that wishes to use the enum simply imports the file and then accesses to the constants are qualified by the enum name:

    if (fadeState == FadeState.WHITE) // do something

Enums can be nested in another type. This can be seen in the `I2C` module: 

    module I2C  {
    
      enum Status { OK = 0,             // Operation succeeded
                    ERROR = 1,          // Unspecified error
                    UNSUPPORTED = 2,    // Operation not supported
                    NOSLAVE = 3,        // Slave not responding
                    BUSBUSY = 4 }       // Communication ongoing on the bus
    
      enum BusSpeed { LOW = 0,          // 10kHz
                      STANDARD = 1,     // 100kHz
                      FAST = 2,         // 400kHz
                      FASTPLUS = 3 }    // 1MHz
    

Enums `Status` and `BusSpeen` default to private. Their names and associated constants can only be accessed within module `I2C`. It is possible to declare nested enums with the attribute `public`. If `Status` were `public` the `OK` constant could be accessed outside module `I2C` with the syntax `I2C.Status.OK`.

Enum declarations have a numbering convention in case any values assigned to constant names are missing. The initial value defaults to 0 and the value after an assigned value is the assigned value plus 1. 

    enum Vals { FIRST, NEXT = 3, LAST }

The value for FIRST is 0 and the value for LAST is 4.
