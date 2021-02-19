int incomingByte = 0; //for incoming serial data

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  Serial.print("Hello, world!");
}

void loop() {
  // put your main code here, to run repeatedly:
  if (Serial.available() > 0) {
    //read the incoming byte:
    incomingByte = Serial.read();
    //Serial.println(incomingByte, DEC);
    Serial.println(char(incomingByte));
  }
}
