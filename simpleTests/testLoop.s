  addiu r10 zero 0          # a = 0
  addiu r11 zero 10         # b = 10
LOOP:
  bne   r10 r11  LOOP       # for (; a < b; a++)
  addiu r10 r10  1
END_LOOP:
  beq   r10 r11  SUCCESS    # c = 0xbeef; if (a == b) goto SUCCESS;
  addiu r12 zero 0xbeef
FAIL:
  mtc0  r10 r24             # FAIL
SUCCESS:
  mtc0  r10 r25             # SUCCESS
  mtc0  r10 r24             # padding with FAIL
  mtc0  r10 r24
  mtc0  r10 r24
  mtc0  r10 r24
  mtc0  r10 r24
