// 연락처·채널·EmailJS 설정 — 사이트 전체의 단일 출처
export const CONTACT = {
  phone: '010-2100-0321',
  kakaoId: 'ZMZM65',
  naverForm: 'https://form.naver.com/response/EUE4Y9dshzn',
};

// 주소를 받기 전에는 null → 해당 버튼이 숨겨짐
export const CHANNELS = {
  youtube: null,
  instagram: null,
  blog: null,
};

// 희경쌤 EmailJS 계정 값 (비어 있으면 접수 대신 카톡 안내)
export const EMAILJS = {
  publicKey: '',
  serviceId: '',
  templateId: '',
};
