// 연락처·채널·EmailJS 설정 — 사이트 전체의 단일 출처
export const CONTACT = {
  phone: '010-2100-0321',
  kakaoId: 'ZMZM65',
};

// 주소를 받기 전에는 null → 해당 버튼이 숨겨짐
export const CHANNELS = {
  youtube: 'https://www.youtube.com/@Heekyoungsam',
  instagram: 'https://www.instagram.com/hkss4m',
  blog: 'https://blog.naver.com/edusolution-',
};

// EmailJS — 에듀솔루션과 같은 계정·서비스, 템플릿만 "희경쌤 사이트" 전용
// (비어 있으면 접수 대신 카톡 안내)
export const EMAILJS = {
  publicKey: 'k9jqBez4YeBqYDgzf',
  serviceId: 'service_i38779r',
  templateId: 'template_xamljrq',
};

// Google 광고 전환 "희경쌤 상담신청" — 접수 성공 시에만 보냄 (태그 본체는 각 페이지 <head>)
export const ADS = {
  conversion: 'AW-16886735349/SdHaCNrhkqwdEPXDnPQ-',
};
