#include <Adafruit_NeoPXL8.h>

// Serial communication configuration
#define BAUD_RATE 9600
#define BUFFER_SIZE 32

// Neopixel configuration
#define NUM_LED 150
int8_t pins[8] = { 16, 17, 18, 19, 20, 21, 22, 23 };
Adafruit_NeoPXL8 strip(NUM_LED, pins, NEO_GRB);

char serialBuffer[BUFFER_SIZE];
uint8_t bufferIndex = 0;

void setup() {
  Serial.begin(BAUD_RATE);
  strip.begin();
  strip.show();  // Initialize all pixels to 'off'
}

void processBuffer() {
  int index = atoi(strtok(serialBuffer, ","));
  char* rgbString = strtok(NULL, "\n");
  String rgbString1 = String(rgbString);
  if (strstr(serialBuffer, "clear-all-cells")) {
    // クリア操作を検知した場合
    for (int i = 0; i < 720; i++) {
      setLEDColor(i, 0, 0, 0); // すべてのLEDをオフにする
    }
  } else if (rgbString1 && rgbString1.charAt(0) == '#' && rgbString1.length() == 7) {
    int r = strtol(rgbString1.substring(1,3).c_str(), NULL, 16);
    int g = strtol(rgbString1.substring(3,5).c_str(), NULL, 16);
    int b = strtol(rgbString1.substring(5,7).c_str(), NULL, 16);
    setLEDColor(index, r, g, b);
  }
  
  // Clear the buffer
  memset(serialBuffer, 0, BUFFER_SIZE);
  bufferIndex = 0;
}

void clearAllCells() {
  for (int i = 0; i < 720; i++) {
    setLEDColor(i, 0, 0, 0); // すべてのLEDをオフにする
  }
}

void setLEDColor(int index, int red, int green, int blue) {
  Serial.print("Changing colors");
  

  if (index < strip.numPixels()) {
    strip.setPixelColor(index, strip.Color(red, green, blue));
  }
  strip.show();
}

void loop() {
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n') {
      processBuffer();
    } else if (bufferIndex < BUFFER_SIZE - 1) {
      serialBuffer[bufferIndex++] = c;
    }
  }
}

