// DRAFT: 희경쌤 검수 필요 — 공개 전 문구 확정
// 기간은 블로그와 같은 "최단기간" 기준. 과목·학점 내역은 쓰지 않는다.
// TABLE[goal][edu] / TABLE.cert[cert][edu] = { level: 'high' | 'check', period }

const same = (level, period) => ({ level, period });

export const TABLE = {
  degree: {
    hs:        same('high', '보통 1년 반~2년'),
    jc_drop:   same('high', '보통 1년 안팎'),
    jc_grad:   same('high', '보통 1년 안팎'),
    univ_drop: same('high', '보통 8개월~1년'),
    univ_grad: same('high', '보통 8개월~1년'),
  },
  transfer: {
    hs:        same('high', '보통 8개월'),
    jc_drop:   same('high', '보통 4~8개월'),
    jc_grad:   same('high', '지금 바로 지원 가능해요'),
    univ_drop: same('high', '이수 상황에 따라 바로~8개월'),
    univ_grad: same('high', '학사편입 바로 지원 가능해요'),
  },
  grad: {
    hs:        same('check', '학사 취득 후 지원 (1년 반~2년)'),
    jc_drop:   same('check', '학사 취득 후 지원 (1년 안팎)'),
    jc_grad:   same('check', '학사 취득 후 지원 (1년 안팎)'),
    univ_drop: same('check', '학사 마무리 후 지원 (8개월~1년)'),
    univ_grad: same('high', '지금 바로 지원 가능해요'),
  },
  cert: {
    sw: {
      hs:        same('high', '보통 8개월~1년'),
      jc_drop:   same('high', '보통 8개월~1년'),
      jc_grad:   same('high', '보통 8개월'),
      univ_drop: same('high', '보통 8개월'),
      univ_grad: same('high', '보통 8개월'),
    },
    childcare: {
      hs:        same('high', '보통 8개월~1년 (실습 별도)'),
      jc_drop:   same('high', '보통 8개월~1년 (실습 별도)'),
      jc_grad:   same('high', '보통 8개월 (실습 별도)'),
      univ_drop: same('high', '보통 8개월 (실습 별도)'),
      univ_grad: same('high', '보통 8개월 (실습 별도)'),
    },
    sanup: {
      hs:        same('high', '보통 4개월'),
      jc_drop:   same('high', '보통 4개월'),
      jc_grad:   same('check', '학과에 따라 바로~4개월'),
      univ_drop: same('check', '학과에 따라 바로~4개월'),
      univ_grad: same('check', '학과에 따라 바로~4개월'),
    },
    gisa: {
      hs:        same('high', '보통 1년'),
      jc_drop:   same('high', '보통 1년 안팎'),
      jc_grad:   same('high', '보통 8개월~1년'),
      univ_drop: same('check', '학과에 따라 바로~1년'),
      univ_grad: same('check', '학과에 따라 바로~4개월'),
    },
  },
};
