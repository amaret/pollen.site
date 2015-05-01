Building Pollen Code
====================

Building pollen code is easy with the cloud compiler. Install it like this: 

      pip install pollen

Using pollen looks like this: 

      pollen -h
      usage: pollen [-h] [--host HOST] [--port PORT] {build} ...

      positional arguments:
         {build}      Run "pollen sub-command --help" for sub-command-specific
                       help. For example: pollen build --help
          build        Compile code. Run this command with parameters indicating
                       what code you wish to build and what bundles you wish to
                       include. Run "pollen build --help" for parameter help.

      optional arguments:
        -h, --help     show this help message and exit
        --host HOST    The Pollen Cloud Compiler gateway to connect to. Default is pcc.amaret.com
        --port PORT    The Pollen Cloud Compiler gateway port to connect to. Default is 80

Help on the build command looks like this: 

      pollen build --help
      usage: pollen build [-h] [-b BUNDLE_PATHS] [-cb CBUNDLE] [--cflags= CFLAGS]
                          [-e ENV] [-m MCU] [-o OUTDIR] [--props PROPS] [-p PRN]
                          [-t {avr-gcc,arm-none-eabi-gcc,efm32-gcc,localhost-gcc}]
                          [-v] [-vv] [-vvv]
                          entry

      positional arguments:
        entry                 top level pollen file (entry point). Qualify with
                              bundle and package.

      optional arguments:
        -h, --help            show this help message and exit
        -b BUNDLE_PATHS, --bundle BUNDLE_PATHS
                              pollen bundle. Paths prefixed with '@' are on server,
                              the rest will be uploaded.
        -cb CBUNDLE, --cbundle CBUNDLE
                              Path prefixed with "@" is on server, else this is the
                              local root of subtree of c files to be uploaded to
                              server. Note root of local subtree uploaded to the
                              cloud will be 'cbundle'.
        --cflags= CFLAGS      quoted string containing extra options to pass to C
                              compiler.
        -e ENV, --environment ENV
                              pollen module used for pollen.environment. Path
                              prefixed with "@" is on server, else will be uploaded.
        -m MCU, --mcu MCU     microcontroller
        -o OUTDIR, --out OUTDIR
                              output dir. Warning: will be emptied before use.
        --props PROPS         properties file (for toolchain compiler and options).
        -p PRN, --print-module PRN
                              pollen module that will implement the print protocol.
                              Path prefixed with "@" is on server, else will be
                              uploaded.
        -t {avr-gcc, efm32-gcc, localhost-gcc}, --toolchain {avr-gcc, efm32-gcc, localhost-gcc}
                              toolchain (compiler).
        -v, --verbose         verbose output
        -vv, --vverbose       very verbose output
        -vvv, --vvverbose     very very verbose output


Cloud compiler output consists of messages and files. The Pollen translator checks the code and translates it to C if there are no Pollen errors, then the appropriate C compiler runs (in the cloud). If there are no errors the code will be linked and downloaded. Depending on the target there may be other tools run on the output (for example, objcopy). 

<!--
Here is the command line to translate 
<a
href="{{site.url}}/pollen/guide/protocols#ref-protocol-timerblink"><strong>this</strong></a>
Pollen file into C for the Arduino Uno. You must supply a local directory path
for the output path.

    pollenc                               \
      -o <output path>                    \    
      -t avr-gcc                          \
      -m atmega328p                       \
      -b @pollen-core                     \
      -b @atmel                           \
      -b @environments                    \
      -e @environments/arduino/Uno        \
      TimerBlink.p                        \

(Note the most current list of supported options are available as the output of `pollen --help`.)

The `-o` (or `--out`) option specifies the local path to the output files.

The `-t` (or `--toolchain`) option specifies the toolchain. Current supported toolchains include avr-gcc,
arm-none-eabi-gcc, and localhost-gcc. The toolchain includes the compiler but may also incorporate other tools (such as avrdude and objcopy).

The option `-m` (or `--mcu`) option specifies the target microcontroller. Valid values for this option depend on the toolchain. (Note that if the toolchain is `localhost-gcc` this option is not supported.)

The option `-b` (or `--bundle`) specificies a bundle. In this case cloud bundles are used which is signified by `@` before the bundle name. These bundles reside in the cloud and support a variety of essential types, services, and hardware. Cloud bundles can be downloaded for inspection or modification. 

The option `-e` (or `--environment`) is the option to specify an environment.
(More information <a href="{{site.url}}/pollen/guide/protocols#ref-protocol-bind-cmmd">here</a>.)

The C compiler output file will have the name TimerBlink-prog.out (or 'top level module name'-prog.out in the general case). It will be located under the output directory specified with `-o`.

Note that other tools may run on that file (e.g. objcopy) so  what the final executeable name will be depends on the toolchain used.

Here is the cloud compiler command line to translate the `TimerBlink` program for the localhost:

    pollenc  -o <output path> -t localhost-gcc                  \
             -b @pollen-core  -b @localhost   -b @environments  \ 
             -e @environments/localhost/LocalHost TimerBlink.p

The values for the `-t` and `-e` options have changed and the `-m` option is not supplied (because it is not meaningful in the localhost context). 
-->
