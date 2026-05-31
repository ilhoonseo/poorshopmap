// 전국 주요 7대 지역(서울, 경기/인천, 부산, 대구/경북, 대전/충청, 광주/전라, 강원/제주)의 가성비 데이트 스팟 데이터베이스
export const dateSpots = [
  /* ==========================================================================
     1. 서울 (Seoul)
     ========================================================================== */
  {
    id: 'seoul-naksan',
    name: '낙산공원 성곽길',
    category: 'walk',
    district: 'seoul',
    districtName: '서울',
    lat: 37.5807,
    lng: 127.0076,
    costPerPerson: 0,
    rating: 4.9,
    frugalScore: 100,
    description: '서울 최고의 야경을 무료로 즐길 수 있는 성곽 산책길입니다. 성벽을 비추는 은은한 조명 덕분에 밤에 걸으면 로맨틱함이 극대화됩니다.',
    tip: '일몰 30분 전에 올라가서 붉은 노을이 도심 야경으로 변하는 순간을 함께 감상하세요!',
    savings: 30000, // 일반 전망대 타워 티켓값 2인 절약 기준
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'seoul-pizza',
    name: '혜화 돌쇠아저씨 화덕피자',
    category: 'food',
    district: 'seoul',
    districtName: '서울',
    lat: 37.5822,
    lng: 127.0019,
    costPerPerson: 9900,
    rating: 4.6,
    frugalScore: 92,
    description: '가성비 넘치는 화덕피자와 치즈 떡볶이 세트로 대학로를 평정한 레트로 맛집입니다. 엄청난 양과 달콤쫀득한 맛이 일품입니다.',
    tip: '대표 메뉴인 "돌쇠 세트"를 주문하면 2~3명이 배부르게 먹을 수 있으며, 세트에 포함된 즉석 라면도 환상적입니다.',
    savings: 25000,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'seoul-ramen',
    name: '여의도 한강라면 피크닉',
    category: 'food',
    district: 'seoul',
    districtName: '서울',
    lat: 37.5284,
    lng: 126.9338,
    costPerPerson: 4500,
    rating: 4.9,
    frugalScore: 100,
    description: '한강 편의점에서 전용 기계로 즉석 조리하는 꼬들꼬들한 라면과 돋자리 피크닉입니다. 남산타워와 강바람을 한 번에 느끼는 낭만 가득 최강 가성비 만찬입니다.',
    tip: '배달존 주변에서 돗자리를 2,000원에 빌려 자리를 잡고, 매콤한 한강 라면에 삼각김밥 조합을 추천합니다.',
    savings: 40000,
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?q=80&w=600&auto=format&fit=crop'
  },

  /* ==========================================================================
     2. 경기/인천 (Gyeonggi/Incheon)
     ========================================================================== */
  {
    id: 'gyeonggi-hwasung',
    name: '수원화성 방화수류정 성곽길',
    category: 'walk',
    district: 'gyeonggi',
    districtName: '경기/인천',
    lat: 37.2872,
    lng: 127.0119,
    costPerPerson: 0,
    rating: 4.8,
    frugalScore: 100,
    description: '수원의 유네스코 세계문화유산인 수원화성 둘레길과 용연 연못 잔디밭입니다. 저녁 성곽길 조명과 연못 정취가 매우 빼어납니다.',
    tip: '낮에는 연못 근처 잔디밭에 돗자리를 펴고 수제 샌드위치를 즐기다, 밤이 되면 팔달산 서장대까지 이어지는 성곽 불빛 코스로 밤 산책하세요.',
    savings: 20000,
    image: 'https://images.unsplash.com/photo-1590076219067-ec6b31e9c20a?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'gyeonggi-taxi',
    name: '송도 센트럴파크 수상택시',
    category: 'activity',
    district: 'gyeonggi',
    districtName: '경기/인천',
    lat: 37.3932,
    lng: 126.6341,
    costPerPerson: 4000,
    rating: 4.8,
    frugalScore: 92,
    description: '송도의 이국적인 빌딩 숲과 해수로를 관통하는 정규 수상택시 코스입니다. 사설 전동 보트에 비해 단돈 4,000원에 강바람 호사 데이트를 누립니다.',
    tip: '해질녘 타임에 맞춰 탑승하면 붉게 물든 고층 빌딩과 수면 위로 번지는 환상적인 골든아워 선셋을 감상하실 수 있습니다.',
    savings: 30000,
    image: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=600&auto=format&fit=crop'
  },

  /* ==========================================================================
     3. 부산 (Busan)
     ========================================================================== */
  {
    id: 'busan-yeoul',
    name: '영도 흰여울문화마을 해안길',
    category: 'walk',
    district: 'busan',
    districtName: '부산',
    lat: 35.0772,
    lng: 129.0438,
    costPerPerson: 0,
    rating: 4.9,
    frugalScore: 100,
    description: '절벽 위에 지어진 흰색 가옥 골목과 바로 아래 드넓게 펼쳐지는 부산 영도의 푸른 바다를 따라 걷는 환상의 해안 도보길입니다.',
    tip: '인생샷 스팟인 "흰여울해안터널" 안쪽에서 바깥쪽 바다 구도로 실루엣 마주보기 샷을 찍으면 멋진 사진을 건질 수 있습니다.',
    savings: 20000,
    image: 'https://images.unsplash.com/photo-1620588661642-e1a5a78280f9?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'busan-soobyeon',
    name: '광안리 민락수변공원 컵회 피크닉',
    category: 'food',
    district: 'busan',
    districtName: '부산',
    lat: 35.1558,
    lng: 129.1302,
    costPerPerson: 7500,
    rating: 4.8,
    frugalScore: 98,
    description: '장엄한 광안대교 다리 야경 조명을 2m 앞에서 공짜로 마주하며 즐기는 낭만 만찬입니다. 고가 횟집 대비 압도적 가성비를 제공합니다.',
    tip: '바로 옆 민락활어직판장에서 만원어치로 저렴하게 포장한 신선한 광안리 컵 회에 컵 떡볶이와 캔 음료를 곁들이는 조합이 유행입니다.',
    savings: 50000,
    image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'busan-milk',
    name: '초량 1941 적산가옥 카페',
    category: 'cafe',
    district: 'busan',
    districtName: '부산',
    lat: 35.1218,
    lng: 129.0305,
    costPerPerson: 6500,
    rating: 4.7,
    frugalScore: 86,
    description: '1940년대에 준공된 고풍스러운 일본식 적산가옥 주택을 그대로 빈티지하게 보존한 아날로그 감성 우유 전문 다방입니다.',
    tip: '대표 품목인 말차 우유나 홍차 우유를 하나씩 골라 야외 나무 정원에서 옛 일본풍 고가구를 감상하며 수다 떨기 좋습니다.',
    savings: 10000,
    image: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=600&auto=format&fit=crop'
  },

  /* ==========================================================================
     4. 대구/경북 (Daegu/Gyeongbuk)
     ========================================================================== */
  {
    id: 'daegu-soosung',
    name: '수성못 야간 음악분수 산책',
    category: 'walk',
    district: 'daegu',
    districtName: '대구/경북',
    lat: 35.8272,
    lng: 128.6169,
    costPerPerson: 0,
    rating: 4.7,
    frugalScore: 100,
    description: '대구를 대표하는 랜드마크 거대 호수 공원입니다. 여름밤에는 화려한 레이저 음악 분수쇼를 완전 무료 관람할 수 있습니다.',
    tip: '5월~10월 사이에 저녁 시간에 맞춰 호수 서편 나무데크에 앉으면 오케스트라 선율에 맞춰 춤추는 분수를 최고 명당에서 감상할 수 있습니다.',
    savings: 20000,
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'daegu-kim',
    name: '김광석 다시그리기길 벽화 산책',
    category: 'walk',
    district: 'daegu',
    districtName: '대구/경북',
    lat: 35.8601,
    lng: 128.6074,
    costPerPerson: 0,
    rating: 4.6,
    frugalScore: 94,
    description: '대구 중구 방천시장 옆 골목길을 고 김광석의 삶과 따뜻한 아쿠스틱 기타 노래 가사들로 물들인 문화 명소 골목길입니다.',
    tip: '골목을 흐르는 "서른 즈음에", "이등병의 편지" 스피커 선율을 들으며 벽화 골목 초입의 달고나 만들기 체험(2,000원)을 나누어 해보세요.',
    savings: 15000,
    image: 'https://images.unsplash.com/photo-1496307653780-3aee7d846c7c?q=80&w=600&auto=format&fit=crop'
  },

  /* ==========================================================================
     5. 대전/충청 (Daejeon/Chungcheong)
     ========================================================================== */
  {
    id: 'daejeon-fountain',
    name: '엑스포과학공원 음악분수 & 한빛탑 야경',
    category: 'walk',
    district: 'daejeon',
    districtName: '대전/충청',
    lat: 36.3764,
    lng: 127.3872,
    costPerPerson: 0,
    rating: 4.8,
    frugalScore: 100,
    description: '대전의 상징 한빛탑 광장에서 밤마다 연출되는 환상적인 레이저 미디어파사드 조명쇼와 대형 춤추는 음악분수입니다.',
    tip: '광장에 돗자리를 펴고 앉아 신나는 아이돌 노래나 클래식에 맞춰 뿜어 나오는 물줄기 댄스쇼를 구경하며 가만히 밤바람 힐링하세요.',
    savings: 25000,
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'daejeon-bread',
    name: '대전 성심당 문화원 맛투어',
    category: 'food',
    district: 'daejeon',
    districtName: '대전/충청',
    lat: 36.3278,
    lng: 127.4272,
    costPerPerson: 3500,
    rating: 4.9,
    frugalScore: 100,
    description: '전국 빵순이들의 성지이자 극강의 가성비를 선사하는 대전의 자부심입니다. 수제 빵들을 믿기지 않는 초저가로 마음껏 고를 수 있습니다.',
    tip: '튀김소보로(1,700원)와 판타롱 부추빵(2,000원)을 하나씩 사들고 200m 근처에 오픈한 빈티지 문화공간 "성심당문화원" 무료 카페 테이블에서 나눠드세요.',
    savings: 20000,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop'
  },

  /* ==========================================================================
     6. 광주/전라 (Gwangju/Jeolla)
     ========================================================================== */
  {
    id: 'gwangju-penguin',
    name: '광주 양림동 펭귄마을 정크아트',
    category: 'walk',
    district: 'gwangju',
    districtName: '광주/전라',
    lat: 35.1382,
    lng: 126.9152,
    costPerPerson: 0,
    rating: 4.5,
    frugalScore: 95,
    description: '버려진 고물과 골동품을 동화 같은 예술작품으로 재탄생시킨 이색 정크아트 야외 펭귄 마을입니다. 레트로 정취가 매혹적입니다.',
    tip: '마을 안쪽 펭귄 주막이나 정겨운 가훈이 달린 집 앞 조형물 모퉁이에서 펭귄 날개 짓하는 재미있는 짝꿍 커플샷을 기획하세요.',
    savings: 10000,
    image: 'https://images.unsplash.com/photo-1531058020387-3be344559be6?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'yeosu-odong',
    name: '여수 오동도 동백 미니 열차',
    category: 'activity',
    district: 'gwangju',
    districtName: '광주/전라',
    lat: 34.7441,
    lng: 127.7669,
    costPerPerson: 1000,
    rating: 4.8,
    frugalScore: 99,
    description: '여수 시내에서 오동도 동백섬 내부 깊숙이 들어가는 바다 위의 장난감 비주얼 파란색 친환경 미니 열차입니다.',
    tip: '편도 티켓이 단돈 1,000원으로 매우 귀엽고, 동백섬 내부의 바다 전망대와 울창한 대나무 산책길은 입장 전액 무료로 가성비가 돋보입니다.',
    savings: 20000,
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=600&auto=format&fit=crop'
  },

  /* ==========================================================================
     7. 강원/제주 (Gangwon/Jeju)
     ========================================================================== */
  {
    id: 'gangwon-lake',
    name: '강릉 경포호 호수자전거 일주',
    category: 'activity',
    district: 'gangwon',
    districtName: '강원/제주',
    lat: 37.7972,
    lng: 128.9105,
    costPerPerson: 3000,
    rating: 4.8,
    frugalScore: 90,
    description: '경포호 해변을 에두르는 넓은 호수 자전거 전용도로입니다. 사설 다인승 자전거에 비해 공공 대여 자전거를 활용하면 매우 알뜰하게 일주합니다.',
    tip: '인당 3,000원인 저렴한 1시간 대여 패스를 끊어 강바람을 뚫고 시원하게 호수 중앙 허균·허난설헌 유적지 정원까지 달리는 하이킹 코스입니다.',
    savings: 25000,
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'gangwon-sky',
    name: '춘천 소양강 스카이워크 공짜 관람',
    category: 'activity',
    district: 'gangwon',
    districtName: '강원/제주',
    lat: 37.8945,
    lng: 127.7212,
    costPerPerson: 2000,
    rating: 4.7,
    frugalScore: 96,
    description: '소양강 강물 한복판 위로 높게 쭉 뻗어있는 156m 길이의 아찔하고 투명한 강화 유리 전망 데크길입니다.',
    tip: '매표소에서 내는 입장료 2,000원은 그대로 춘천사랑상품권으로 돌려받기 때문에, 바로 앞 춘천 시내 닭갈비 맛집이나 카페에서 요금 결제로 100% 쓸 수 있어 실질적 무료입니다.',
    savings: 12000,
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'jeju-coast',
    name: '제주 용두암 밤바다 해안산책로',
    category: 'walk',
    district: 'gangwon',
    districtName: '강원/제주',
    lat: 33.5165,
    lng: 126.5122,
    costPerPerson: 0,
    rating: 4.9,
    frugalScore: 100,
    description: '용이 포효하는 형상의 용두암 바위를 중심으로 제주 도심 앞바다 파도 소리를 생생히 들으며 걷는 야간 무공해 해안 도보길입니다.',
    tip: '제주공항 도착 즉시 혹은 집으로 돌아가기 직전 캐리어를 가볍게 보관해 두고, 파도와 성산대교 야경 조명을 함께 걷는 최고의 알뜰 선셋 명소입니다.',
    savings: 30000,
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=600&auto=format&fit=crop'
  }
];
