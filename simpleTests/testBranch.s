  beq zero zero TAKEN
  addiu r9 zero  2
NOT_TAKEN:
  addiu r10 zero 1
  j     END
  addiu r11 zero 1
TAKEN:
  addiu r10 zero 2
END:
  add zero zero zero
  add zero zero zero
  add zero zero zero
  add zero zero zero
  mtc0 r10 r25
  add zero zero zero
  add zero zero zero
  add zero zero zero
  add zero zero zero
  add zero zero zero
  add zero zero zero
  add zero zero zero
  add zero zero zero
  add zero zero zero
  add zero zero zero
  add zero zero zero
  add zero zero zero
  add zero zero zero
