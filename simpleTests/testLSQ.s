  addiu r10 zero 0xbeef
  addiu r11 zero 0xdead
  sw    r10 0(r11)
  lw    r9  0(r11)
  beq   r9  r10  SUCCESS
  add   zero zero zero
FAIL:
  mtc0  r9  r24
SUCCESS:
  mtc0  r9  r25
  mtc0  r9  r24
  mtc0  r9  r24
  mtc0  r9  r24
  mtc0  r9  r24
  mtc0  r9  r24
  mtc0  r9  r24
  mtc0  r9  r24
  mtc0  r9  r24
  mtc0  r9  r24
  mtc0  r9  r24
  mtc0  r9  r24
  mtc0  r9  r24
  mtc0  r9  r24
  mtc0  r9  r24
  mtc0  r9  r24
