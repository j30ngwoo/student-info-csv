function convertToCSV() {
  const rawInput = document.getElementById('inputData').value;
  const input = rawInput.replace(/\s+/g, '');

  const header = ['연번', '이름', '학번', '단과대학', '학과', '학년', '전화번호'];
  const result = [header.join(',')];

  // 전화번호 포맷: 하이픈 있는 경우와 없는 경우 모두
  const phoneRegex = /(010\d{8}|010-\d{4}-\d{4})/g;

  let records = [];
  let match;
  let lastIndex = 0;

  // 전화번호 위치 탐색 → 슬라이싱 지점 파악
  while ((match = phoneRegex.exec(input)) !== null) {
    const phoneEndIndex = match.index + match[0].length;
    const recordChunk = input.slice(lastIndex, phoneEndIndex);
    records.push(recordChunk);
    lastIndex = phoneEndIndex;
  }

  // 각 레코드에 정규식 적용
  const recordPattern = /^(\d+)([가-힣]+)(\d{9})([A-Za-z가-힣0-9]+(?:대학|과학원|기술원))(.+?)(\d)(010\d{8}|010-\d{4}-\d{4})$/;

  records.forEach(rec => {
    const m = rec.match(recordPattern);
    if (m) {
      const seq = m[1];
      const name = m[2];
      const studentId = m[3];
      const college = m[4];
      const major = m[5];
      const year = m[6];
      const phone = normalizePhone(m[7]);

      result.push([seq, name, studentId, college, major.trim(), year, phone].join(','));
    } else {
      console.warn('파싱 실패:', rec);
    }
  });

  document.getElementById('outputCSV').value = result.join('\n');
}

function normalizePhone(phone) {
  phone = phone.replace(/[^0-9]/g, '');
  if (phone.length === 11) return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  return phone;
}

function downloadCSV() {
  const csvContent = document.getElementById('outputCSV').value;
  const BOM = '\uFEFF'; // UTF-8 BOM 추가
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = '학생정보.csv';
  a.click();
  URL.revokeObjectURL(url);
}
