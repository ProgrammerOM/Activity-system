function checkRude(data) {
    // คำหยาบและประโยคที่จะนำมาแทนที่
    var rudeWords = [
      "ashole",
      "a s h o l e",
      "a.s.h.o.l.e",
      "bitch",
      "b i t c h",
      "b.i.t.c.h",
      "shit",
      "s h i t",
      "s.h.i.t",
      "fuck",
      "dick",
      "f u c k",
      "d i c k",
      "f.u.c.k",
      "d.i.c.k",
      "มึง",
      "มึ ง",
      "ม ึ ง",
      "ม ึง",
      "มงึ",
      "มึ.ง",
      "มึ_ง",
      "มึ-ง",
      "มึ+ง",
      "กู",
      "ควย",
      "ค ว ย",
      "ค.ว.ย",
      "คอ วอ ยอ",
      "คอ-วอ-ยอ",
      "ปี้",
      "เหี้ย",
      "ไอ้เหี้ย",
      "เฮี้ย",
      "ชาติหมา",
      "ชาดหมา",
      "ช า ด ห ม า",
      "ช.า.ด.ห.ม.า",
      "ช า ติ ห ม า",
      "ช.า.ติ.ห.ม.า",
      "สัดหมา",
      "สัด",
      "เย็ด",
      "หี",
      "สันดาน",
      "แม่ง",
      "ระยำ",
      "ส้น ตีน",
      "แตด"
    ];
    
    var replacement = 'คำไม่สุภาพ';
  
    for (var i = 0; i < rudeWords.length; i++) {
      var pattern = new RegExp(rudeWords[i], "gi");
      data = data.replace(pattern, replacement);
    }
  
    return data;
  }
  
  let text = 'มึง';
  let result = checkRude(text);
  console.log(result);
  