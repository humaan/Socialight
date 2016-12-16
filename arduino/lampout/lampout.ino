
// changes colour of LED lamp based on serial events

#include <SD.h>
#include <SPI.h>
#include <TMRpcm.h>

TMRpcm sample;
const int SDPIN = 10; // default
const int REDPIN = 7;
const int GREENPIN = 5;
const int BLUEPIN = 6;
const int SPEAKERPIN = 9;
String incoming = "";
File root;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(REDPIN, OUTPUT);
  pinMode(GREENPIN, OUTPUT);
  pinMode(BLUEPIN, OUTPUT);
  setRGB(255,0,0); // if lights work, show red
//  tone(SPEAKERPIN, 180, 100); // if speaker works, play tone
  // set the speaker pin 
  sample.speakerPin = SPEAKERPIN;
  Serial.println("Initialising SD card...");
  if (!SD.begin(SDPIN)) { // see if the card is ok
    Serial.println("Card init failed");
    return;   // It's not there, don't do anything
  }
  sample.volume(10);
  sample.play("1.wav");
  Serial.println(sample.isPlaying());
//  Serial.println("looking for datafile");
//  File dataFile = SD.open("chime.wav");
//  // if the file is available, write to it:
//  if (dataFile) {
//    Serial.println("found datafile");
//    while (dataFile.available()) {
//      Serial.write(dataFile.read());
//    }
//    dataFile.close();
//  }
}

void loop() {
  // put your main code here, to run repeatedly:
  while (Serial.available()) {
    incoming = Serial.readString();
    if (incoming.substring(0,4).equals("INST")) {
      logINST(incoming.substring(5));
    } else if (incoming.substring(0,4).equals("TWIT")) {
      logTWIT(incoming.substring(5));
    }
    Serial.println("Lamp logged: " + incoming);
  }
}

void logINST(String activity) {
  setRGB(230,94,135);
  playTone(activity);
}

void logTWIT(String activity) {
  setRGB(85,172,238);
  playTone(activity);
}

void playTone(String activity) {
  int freq = 0;
  char* fname;
  if (activity.equals("lik")) {
    freq = 261;
    fname = "1.wav";
  } else if (activity.equals("ret")) {
    freq = 294;
    fname = "2.wav";
  } else if (activity.equals("fol")) {
    freq = 329;
    fname = "3.wav";
  } else if (activity.equals("men")) {
    freq = 349;
    fname = "4.wav";
  } else if (activity.equals("msg")) {
    freq = 392;
    fname = "5.wav";
  } else if (activity.equals("tag")) {
    freq = 440;
    fname = "6.wav";
  }
//  tone(SPEAKERPIN, freq, 100);
  sample.play(fname);
}

void setRGB(int redVal, int greenVal, int blueVal) {
  analogWrite(REDPIN, redVal);
  analogWrite(GREENPIN, greenVal);
  analogWrite(BLUEPIN, blueVal);
}

