#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>

int aPin = A0;
HTTPClient http;

void setup() {
  Serial.begin(115200);
  pinMode(16,OUTPUT);
  WiFi.begin("INFINITUMD967", "4127513420");   //WiFi connection
 
  while (WiFi.status() != WL_CONNECTED) {  //Wait for the WiFI connection completion
 
    delay(500);
    Serial.println("Waiting for connection");
 
  }

  Serial.println(WiFi.localIP());
}
 
void loop() {

  Serial.begin(115200);                 //Serial connection

  if(WiFi.status()== WL_CONNECTED){   //Check WiFi connection status
 
   HTTPClient http;    //Declare object of class HTTPClient

   
  int a = analogRead(aPin);
 
  Serial.println("Hello from ESP8266");
  Serial.println(a);

  if(a <= 800){
    digitalWrite(16,HIGH);  
  }
  else{
   digitalWrite(16, LOW);  
  }

  String b = (String) a;
 
   http.begin("http://ddiproyectofinal.glitch.me/api/rooms/BjpgUJTT/"+b);      //Specify request destination
   http.addHeader("Content-Type", "text/plain");  //Specify content-type header
 
   int httpCode = http.POST("Message from ESP8266");   //Send the request
   String payload = http.getString();                  //Get the response payload
 
   Serial.println(httpCode);   //Print HTTP return code
   Serial.println(payload);    //Print request response payload
 
   http.end();  //Close connection
 
 }

 else{
 
    Serial.println("Error in WiFi connection");  
 
 }

  delay(1000);
}
