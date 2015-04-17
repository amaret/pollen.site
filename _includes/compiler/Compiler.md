Building Pollen Code
====================

Cloud compiler output consists of messages and files. The Pollen translator checks the code and translates it to C if there are no Pollen errors, then the appropriate C compiler runs (in the cloud). If there are no errors the code will be linked and downloaded. Depending on the target there may be other tools run on the output (for example, objcopy). 

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
