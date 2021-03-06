#include <LiquidCrystal.h>

const int pin_RS = 8;
const int pin_EN = 9;
const int pin_d4 = 4;
const int pin_d5 = 5;
const int pin_d6 = 6;
const int pin_d7 = 7;
const int pin_BL = 10;

LiquidCrystal lcd(pin_RS, pin_EN, pin_d4, pin_d5, pin_d6, pin_d7);

int displayTime = 5000;

void setup()
{
  Serial.begin(9600);
  Serial.setTimeout(5000);
  while (!Serial)
  {
    ; // wait for serial port to connect. Needed for native USB
  }

  // set backlight pin
  pinMode(pin_BL, OUTPUT);

  // turn backlight off
  digitalWrite(pin_BL, LOW);

  // init lcd
  lcd.begin(16, 2);

  // clear lcd
  lcd.setCursor(0, 0);
  lcd.clear();
}

void checkButton()
{
  // adjust the keyrate to match
  // your preferred pressing button speed
  int keyRate = 1000;
  int x = analogRead(0);

  if (x < 1000)
  {
    Serial.println("ECHO: x = " + String(x));
    delay(keyRate);
  }

  // this is analogue reading
  // the threshold may differs every hardware
  // feel free to tweak the value
  if (x <= 50)
  {
    Serial.println("BTN_RIGHT_PRESSED");
  }
  else if (x <= 100)
  {
    Serial.println("BTN_UP_PRESSED");
  }
  else if (x <= 300)
  {
    Serial.println("BTN_DOWN_PRESSED");
  }
  else if (x <= 500)
  {
    Serial.println("BTN_LEFT_PRESSED");
  }
  else if (x <= 700)
  {
    Serial.println("BTN_SELECT_PRESSED");
  }
}

void loop()
{
  while (!Serial.available())
  {
    checkButton();
  }

  while (Serial.available() > 0)
  {
    String str = Serial.readStringUntil('\n');
    Serial.println("ECHO: " + str);

    if (str == "LCD_BL_ON")
    {
      digitalWrite(pin_BL, HIGH);
      Serial.println("RESULT: LCD BL = ON");
    }
    else if (str == "LCD_BL_OFF")
    {
      digitalWrite(pin_BL, LOW);
      Serial.println("RESULT: LCD BL = OFF");
    }
    else if (str.startsWith("DISP_TIME_"))
    {
      String timeStr = str.substring(10);
      int displayTime = timeStr.toInt();
      Serial.println("RESULT: DISPLAY TIME = " + String(displayTime));
    }
    else
    {
      if (str.length() > 32)
      {
        str = str.substring(0, 32);
      }

      if (str.length() > 16)
      {
        String str1 = str.substring(0, 16);
        String str2 = str.substring(16, 32);

        lcd.print(str1);
        lcd.setCursor(0, 1);
        lcd.print(str2);

        // display time
        delay(displayTime);
        Serial.println("RESULT: OK");
      }
      else
      {
        lcd.print(str);

        // display time
        delay(displayTime);
        Serial.println("RESULT: OK");
      }

      // clear lcd
      lcd.setCursor(0, 0);
      lcd.clear();
    }
  }
}
