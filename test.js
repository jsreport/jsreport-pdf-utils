const val = `g ro u p @@@e yJ s b 2 d v UGF 0 a CI6 Imh 0 d HA 6 L y9 tY W5 h Z 2 Uu Y 2 h p c HB s e WRld i5 jb 2 0 v V X Nlc mRh d GE v RGV h b GV yT G9 n b y9 iM2 Y wY T Q2 Y y0 zMWM3 L T Q1 NGQtY mU1 Z C0 3 Mzd mMT Y 4 OT E 1 MWNL L n B u Z yIs ImV 2 Z W5 0 T mF tZ S I6 Ik 9 jb 2 5 v b W9 3 b 2 Mg Rml2 Z S B P J 3 Mg U3 B p c ml0 IF d lY X IiL CJ v c mRlc k lk Ijo xODg wNT g s Im9 yZ GV yRGF 0 Z S I6 IjUv Mjc v MjA yMCIs ImJ p b GxQa G9 u Z S I6 IjQxNDY 5 OT U2 Njk iL CJ ia Wxs T GF zd E 5 h b WUiOiJ HZ W5 6 IiwiY mls b E Z p c n N0 T mF tZ S I6 Ik Rh b mllb GxlIiwiY mls b E F k Z HJ lc 3 MxIjo iT jk 2 MzE g V 2 ls b G9 3 IF Z p Z X c g RHJ p d mUiL CJ ia Wxs QWRk c mV zc zIiOiIiL CJ ia Wxs Q2 l0 e S I6 Ild h d GV yd G9 3 b iIs ImJ p b GxT d GF 0 Z S I6 Ild J IiwiY mls b F p p c CI6 IjUzMDk 0 Iiwic Gxh e WV yT mF tZ S I6 Ik d lb n o s IE Rh b mllb GxlIiwid GV h b U5 h b WUiOiJ V MT Qg RlA g T k F WWS B Db Glu d G9 u Iiwic 2 h p c HB p b md Ue X B lIjo iT 3 J n Y W5 p e mF 0 a W9 u IE Rlb Gl2 Z X J 5 IiwiY 2 F yd F Rv d GF s Ijo iJ Dg 5 L jc 1 Iiwia GF u Z Gxp b md Ub 3 Rh b CI6 IiQ0 L jA wIiwic 2 h p c HB p b md Ub 3 Rh b CI6 IiQwL jA wIiwid GF 4 V G9 0 Y WwiOiIk NC4 2 OS Is Im9 yZ GV yV G9 0 Y WwiOiIk OT g u NDQiL CJ v c mRlc k l0 Z W1 zIjp b e yJ wc m9 k d WN0 S W1 h Z 2 V QY X Ro Ijo ia HR0 c HM6 L y9 k Z X Z jZ G4 u Y 2 h p c HB s e S 5 u Z X Qv a W1 h Z 2 V zL 3 B yb 2 R1 Y 3 Rwc m9 jZ X NzL zE wMDE zL zIyMDA yL zUzMT Y 5 My8 yNT A v Y zQ0 ODd mZ mMtOT B lMy0 0 MjJ mL WIxMDA tMGJ mMWV jOT F iOT d k L mp wZ yIs Iml0 Z W1 T a 3 UiOiJ QQzU1 T F MiL CJ 2 Z W5 k b 3 IiOiJ T Y W5 NY X IiL CJ wc m9 k d WN0 T mF tZ S I6 IlB v c n Qg J iB Db 2 1 wY W5 5 ICY jMT c 0 OyA g L S B Mb 2 5 n IF Ns Z WV 2 Z S B Db 3 J lIE J s Z W5 k IF RlZ S 4 iL CJ za X p lIjo iT CIs ImNv b G9 yIjo iT mF 2 e S Is In F 0 e S I6 MS wic HJ p Y 2 UiOiIk MT Y u MDA iL CJ le HRlb mRlZ CI6 IiQxNi4 wMCIs ImJ h Y 2 tv c mRlc lN1 Y k 5 v d GV zIjo iIiwiY X R0 c mlid X Rlc yI6 W1 0 s In B yb 2 Nlc 3 NOY W1 lIjo iUE F HRS B DIHNv Z n RiY Wxs IHB yIn 0 s e yJ wc m9 k d WN0 S W1 h Z 2 V QY X Ro Ijo ia HR0 c HM6 L y9 k Z X Z jZ G4 u Y 2 h p c HB s e S 5 u Z X Qv a W1 h Z 2 V zL 3 B yb 2 R1 Y 3 Rwc m9 jZ X NzL zE wMDE zL zIyMDA yL zUzMT Y 5 NC8 yNT A v Y mU1 NzlmOT E tNzB k OC0 0 NjNk L WE 3 MT UtY Wite m@@@`

function parseGroup (text) {
  let value = null

  // we need to consider spaces in the string because in other OS the parsed text
  // can gives us string with space between the letters
  let regexp = /g[ ]?r[ ]?o[ ]?u[ ]?p[ ]?@[ ]?@[ ]?@([^@]*)@[ ]?@[ ]?@/gm
  let match = regexp.exec(text)

  while (match != null) {
    if (match.length < 1) {
      return value
    }

    if (match[1] != null && match[1] !== '') {
      const str = match[1].replace(/[ ]/g, '')
      value = JSON.parse(Buffer.from(str, 'base64').toString())
    }

    match = regexp.exec(text)
  }

  return value
}

parseGroup(val)
