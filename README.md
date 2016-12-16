# socialight #

A musical lamp that changes colour and plays a tone based on events from social media platforms (currently Twitter and Instagram).

Uses:

* Expressjs Nodejs webserver that writes to the Serial port
* Arduino with RGB LED and piezo (which should really be a nice speaker eventually)
* Event triggers via HTTP requests (will use IFTTT Maker hooks)
* TMRpcm library: https://github.com/TMRh20/TMRpcm/wiki
* Keyes Datalogger Shield: https://learn.adafruit.com/adafruit-data-logger-shield

Sun 17 Apr: Crapstyle proof of concept code. Strings will need to become char arrays for efficiency. Tones are fixed and limited. Needs refining on all fronts. No Facebook yet. Haven't tested with live events yet.

Sun 22 May: Now plays wavs from SD card.