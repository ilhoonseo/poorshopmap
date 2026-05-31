// 서울의 가성비 좋고 로맨틱한 데이트 스팟 데이터베이스
export const dateSpots = [
  // 1. 혜화 / 대학로 스팟
  {
    id: 'hyehwa-naksan',
    name: '낙산공원 성곽길',
    category: 'walk',
    district: 'hyehwa',
    districtName: '혜화/대학로',
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
    id: 'hyehwa-pizza',
    name: '혜화 돌쇠아저씨',
    category: 'food',
    district: 'hyehwa',
    districtName: '혜화/대학로',
    lat: 37.5822,
    lng: 127.0019,
    costPerPerson: 9900,
    rating: 4.6,
    frugalScore: 92,
    description: '가성비 넘치는 화덕피자와 치즈 떡볶이 세트로 대학로를 평정한 노포 맛집입니다. 엄청난 양과 달콤쫀득한 맛이 일품입니다.',
    tip: '대표 메뉴인 "돌쇠 세트"를 주문하면 2~3명이 배부르게 먹을 수 있으며, 세트에 포함된 즉석 라면도 일품입니다.',
    savings: 25000, // 일반 이탈리안 레스토랑 대비 절약
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'hyehwa-cafe',
    name: '학림다방',
    category: 'cafe',
    district: 'hyehwa',
    districtName: '혜화/대학로',
    lat: 37.5819,
    lng: 127.0017,
    costPerPerson: 6000,
    rating: 4.8,
    frugalScore: 85,
    description: '1956년부터 시작된 역사와 문화의 향기가 흐르는 클래식 다방입니다. 옛 감성의 소파와 복층 구조가 아늑하고 깊이 있는 대화를 나눌 수 있게 해줍니다.',
    tip: '시그니처인 비엔나 커피와 함께 수제 크림치즈 케이크(블루베리 잼 추가)를 꼭 나눠 드세요!',
    savings: 10000, // 프랜차이즈 감성 카페 대비 절약 및 역사적 가치
    image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'hyehwa-theater',
    name: '대학로 연극 당일 현장할인',
    category: 'activity',
    district: 'hyehwa',
    districtName: '혜화/대학로',
    lat: 37.5835,
    lng: 127.0025,
    costPerPerson: 12000,
    rating: 4.7,
    frugalScore: 95,
    description: '혜화역 출구 주변 티켓박스나 어플을 이용해 당일 남은 좌석을 예매하면 60~70% 저렴한 가격에 퀄리티 높은 로맨틱 코미디 연극을 볼 수 있습니다.',
    tip: '주말 오후 2시 이전에 마로니에 공원 주변 공식 매표소(혜화역 2번 출구 부근)에서 물어보면 보너스 할인 혜택을 종종 줍니다.',
    savings: 40000, // 멀티플렉스 특별관이나 정가 연극 대비 절약
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=600&auto=format&fit=crop'
  },

  // 2. 홍대 / 신촌 스팟
  {
    id: 'hongdae-midoin',
    name: '미도인 홍대',
    category: 'food',
    district: 'hongdae',
    districtName: '홍대/신촌',
    lat: 37.5548,
    lng: 126.9213,
    costPerPerson: 12500,
    rating: 4.7,
    frugalScore: 88,
    description: '레트로 모던풍의 고급스러운 인테리어 속에서 부드럽고 든든한 스테이크 덮밥을 1만원 초반대에 즐길 수 있는 맛집입니다. 데이트 분위기로 완벽합니다.',
    tip: '오전 11시 30분 전 선착순으로 하루 7그릇만 판매하는 "400 스테이크 덮밥" 스페셜 이벤트를 노려보세요!',
    savings: 30000, // 정통 스테이크 하우스 대비 절약
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'hongdae-cafe',
    name: '모리츠플라츠 (Moritzplatz)',
    category: 'cafe',
    district: 'hongdae',
    districtName: '홍대/신촌',
    lat: 37.5563,
    lng: 126.9272,
    costPerPerson: 5500,
    rating: 4.5,
    frugalScore: 82,
    description: '빈티지 가구 전시와 아트 디렉팅이 돋보이는 갤러리형 넓은 카페입니다. 힙하고 이국적인 무드가 넘치지만 커피 가격은 합리적입니다.',
    tip: '디자이너 가구들에 직접 앉아볼 수 있습니다. 창가의 햇살 좋은 자리가 사진이 가장 잘 나옵니다.',
    savings: 8000, // 값비싼 인스타 유명 포토존 카페 대비 절약
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'hongdae-board',
    name: '홍대 보드카페 놀이터',
    category: 'activity',
    district: 'hongdae',
    districtName: '홍대/신촌',
    lat: 37.5552,
    lng: 126.9228,
    costPerPerson: 3000,
    rating: 4.6,
    frugalScore: 98,
    description: '시간당 3,000원 이하로 즐길 수 있는 실내 액티비티입니다. 다양한 게임으로 서로 장난치며 친밀도를 순식간에 높일 수 있습니다.',
    tip: '2인 전용 꿀잼 게임인 "다빈치 코드"나 "스플렌더"를 추천합니다. 지는 사람이 꿀팁 카페 커피 쏘기 내기를 해보세요!',
    savings: 20000, // 테마파크나 비싼 방탈출 게임 대비 절약
    image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'hongdae-walk',
    name: '경의선 숲길 (책거리)',
    category: 'walk',
    district: 'hongdae',
    districtName: '홍대/신촌',
    lat: 37.5582,
    lng: 126.9261,
    costPerPerson: 0,
    rating: 4.7,
    frugalScore: 100,
    description: '옛 철길을 공원으로 복원하여 도심 한복판에서 숲속을 걷는 듯한 느낌을 주는 명소입니다. 테마별 도서 미니 부스와 은은한 숲길 조명이 펼쳐져 있습니다.',
    tip: '홍대입구역 6번 출구부터 책거리를 쭉 걷다가, 버스킹 공연이 열리는 잔디밭 주변 벤치에 앉아서 바람을 쐬는 코스가 최고입니다.',
    savings: 15000, // 유료 식물원 코스 대비 절약
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=600&auto=format&fit=crop'
  },

  // 3. 성수 / 서울숲 스팟
  {
    id: 'seongsu-gamja',
    name: '소문난성수감자탕',
    category: 'food',
    district: 'seongsu',
    districtName: '성수/서울숲',
    lat: 37.5445,
    lng: 127.0560,
    costPerPerson: 10500,
    rating: 4.7,
    frugalScore: 94,
    description: '백종원의 3대천왕에 방영된 국가대표 감자탕 맛집입니다. 1인 뚝배기로 주문하면 단돈 10,500원에 살코기가 산처럼 쌓인 든든하고 깊은 맛의 식사가 가능합니다.',
    tip: '웨이팅이 항시 있지만, 회전율이 빨라 금방 들어갑니다. 다 먹고 난 뒤 2,000원 추가해서 고소한 볶음밥은 필수 코스!',
    savings: 20000, // 성수동 파스타 레스토랑 대비 반값 수준
    image: 'https://images.unsplash.com/photo-1547928576-a4a33237eceb?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'seongsu-cafe',
    name: '성수 메이플탑',
    category: 'cafe',
    district: 'seongsu',
    districtName: '성수/서울숲',
    lat: 37.5412,
    lng: 127.0435,
    costPerPerson: 7000,
    rating: 4.4,
    frugalScore: 80,
    description: '미국식 정통 다이너 느낌의 트렌디한 공간에서 풍성하고 이국적인 디저트와 브런치를 파는 카페입니다. 성수의 비싼 물가 중에서도 돋보이는 가성비를 가졌습니다.',
    tip: '팬케이크 세트나 하우스 와플을 하나 시키고 아메리카노를 곁들여 나누어 드시면 훌륭하고 배부른 디저트 타임이 완성됩니다.',
    savings: 12000, // 호텔 델리식 브런치 대비 높은 퀄리티와 저렴한 가격
    image: 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'seongsu-exhibition',
    name: '서울숲 언더스탠드에비뉴',
    category: 'activity',
    district: 'seongsu',
    districtName: '성수/서울숲',
    lat: 37.5430,
    lng: 127.0416,
    costPerPerson: 0,
    rating: 4.5,
    frugalScore: 100,
    description: '알록달록 다채로운 컨테이너로 조성된 문화 창조 플랫폼입니다. 청년 창업가들의 개성 넘치는 편집숍, 무료 오픈 전시 및 푸드 마켓이 모여있어 보는 재미가 쏠쏠합니다.',
    tip: '수시로 열리는 무료 길거리 플리마켓이나 버스킹 일정을 미리 홈페이지나 SNS에서 체크하고 방문해보세요!',
    savings: 30000, // 유료 디자인 페어나 멀티플렉스 복합 공간 요금 절약
    image: 'https://images.unsplash.com/photo-1531058020387-3be344559be6?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'seongsu-walk',
    name: '서울숲 거울연못 & 메타세콰이어길',
    category: 'walk',
    district: 'seongsu',
    districtName: '성수/서울숲',
    lat: 37.5441,
    lng: 127.0381,
    costPerPerson: 0,
    rating: 4.9,
    frugalScore: 100,
    description: '연못이 주위 울창한 숲을 거울처럼 완벽하게 투영해 환상적인 데칼코마니 뷰를 선사하는 사진 명소입니다. 바로 옆 메타세콰이어 길까지 걸으면 힐링 그 자체입니다.',
    tip: '연못 시작점 끝부분 모서리에 쪼그려 앉아 파란 하늘과 나무가 연못에 꽉 차게 구도를 잡고 사진을 찍어주면 인생샷 보장!',
    savings: 20000, // 외곽 수목원 입장료 대비 절약
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600&auto=format&fit=crop'
  },

  // 4. 강남 스팟
  {
    id: 'gangnam-tamtam',
    name: '땀땀 강남본점',
    category: 'food',
    district: 'gangnam',
    districtName: '강남',
    lat: 37.4998,
    lng: 127.0289,
    costPerPerson: 13000,
    rating: 4.6,
    frugalScore: 84,
    description: '고급스러운 동남아 휴양지 느낌의 인테리어에 곱창이 듬뿍 들어간 매운 소곱창 쌀국수를 판매하는 최고의 강남 핫플레이스입니다. 압도적인 그릇 크기와 고기 양을 자랑합니다.',
    tip: '국물 양이 엄청나게 많기 때문에 면사리와 육수 리필을 요청하면 무료로 제공받아 곱창전골 먹듯 두 명이서 배 터지게 즐길 수 있습니다.',
    savings: 15000, // 강남역 주변 정통 아시안 비스트로 대비 절약
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'gangnam-cafe',
    name: '평화다방 강남점',
    category: 'cafe',
    district: 'gangnam',
    districtName: '강남',
    lat: 37.4988,
    lng: 127.0272,
    costPerPerson: 5000,
    rating: 4.4,
    frugalScore: 86,
    description: '70~80년대 한국 다방을 뉴트로 감성으로 완벽히 재해석한 대형 이색 카페입니다. 화려한 강남 한복판에서 차분하고 아늑한 쌍화차와 단팥빵, 가성비 음료를 판매합니다.',
    tip: '귀여운 레트로 캐릭터 굿즈가 있는 진열장에서 커플 거울 셀카를 꼭 남기고, 쫀득한 카스텔라 롤을 커피에 찍어 드세요!',
    savings: 9000, // 강남역 주변의 비좁고 시끄러운 일반 카페 대비 편안함과 저렴함
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'gangnam-teum',
    name: '일상비일상의틈 by U+',
    category: 'activity',
    district: 'gangnam',
    districtName: '강남',
    lat: 37.5009,
    lng: 127.0264,
    costPerPerson: 0,
    rating: 4.8,
    frugalScore: 100,
    description: '지하부터 루프탑까지 독창적인 테마로 꾸며진 완전 무료 복합 문화 스페이스입니다. 트렌디한 팝업 스토어, 오락기, 포토 부스, 도서관 등을 연중무휴 무료 개방합니다.',
    tip: '앱을 설치하고 무료 회원 바코드를 찍으면 즉석 사진 인화 혜택 및 미션 참여 시 무료 음료나 귀여운 커플 굿즈를 제공하는 혜택이 상시 열립니다.',
    savings: 25000, // 유료 체험형 전시회나 아케이드 게임 이용료 절약
    image: 'https://images.unsplash.com/photo-1496307653780-3aee7d846c7c?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'gangnam-walk',
    name: '도심 속 비밀의 정원 선정릉',
    category: 'walk',
    district: 'gangnam',
    districtName: '강남',
    lat: 37.5087,
    lng: 127.0487,
    costPerPerson: 1000,
    rating: 4.6,
    frugalScore: 99,
    description: '초고층 빌딩 숲으로 둘러싸인 강남 한복판에 자리 잡은 조선 왕릉입니다. 울창한 소나무 숲길과 넓은 잔디밭이 있어 1,000원이라는 믿기지 않는 입장료로 깊은 힐링을 줍니다.',
    tip: '왕릉 주변의 흙길을 걸으며 바쁜 일상을 잠시 멈추고 고즈넉하게 커플 이어폰으로 음악을 나누어 들으며 대화하기에 완벽한 스팟입니다.',
    savings: 18000, // 시끌벅적한 상업 쇼핑몰 데이트 스트레스 탈출 및 가치 환산
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=600&auto=format&fit=crop'
  },

  // 5. 여의도 / 한강 스팟
  {
    id: 'yeouido-ramen',
    name: '여의도 한강라면 & 잔디밭 피크닉',
    category: 'food',
    district: 'yeouido',
    districtName: '여의도/한강',
    lat: 37.5284,
    lng: 126.9338,
    costPerPerson: 4500,
    rating: 4.9,
    frugalScore: 100,
    description: '한강 편의점에서 전용 기계로 즉석 조리하는 꼬들꼬들한 라면과 돋자리 피크닉입니다. 남산타워와 밤섬, 강바람을 한 번에 느끼는 낭만 가득 최강 가성비 만찬입니다.',
    tip: '배달존 주변에서 돗자리를 2,000원에 빌려 자리를 잡고, 매콤한 한강 라면에 삼각김밥과 바나나우유 조합을 곁들이면 천국이 따로 없습니다.',
    savings: 45000, // 강변 전망의 이탈리안 레스토랑 요금 대비 폭발적인 가성비
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'yeouido-cafe',
    name: '콘래드 서울 10G 카페',
    category: 'cafe',
    district: 'yeouido',
    districtName: '여의도/한강',
    lat: 37.5252,
    lng: 126.9254,
    costPerPerson: 6500,
    rating: 4.6,
    frugalScore: 78,
    description: '5성급 럭셔리 콘래드 호텔 로비에 위치한 스타일리시한 카페입니다. 고급스러운 하이엔드 인테리어와 높은 층고를 제공하지만, 커피와 브레드는 일반 카페와 유사한 가격입니다.',
    tip: '호텔의 럭셔리하고 프라이빗한 분위기를 즐기며 아메리카노와 시그니처 샌드위치를 함께 나눠 드세요. 가성비로 5성급 데이트 느낌을 낼 수 있습니다.',
    savings: 30000, // 호텔 애프터눈 티 세트 대비 무려 80% 이상 절약하며 호캉스 분위기 체감
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'yeouido-bike',
    name: '따릉이 타고 한강 강바람 하이킹',
    category: 'activity',
    district: 'yeouido',
    districtName: '여의도/한강',
    lat: 37.5262,
    lng: 126.9300,
    costPerPerson: 1000,
    rating: 4.8,
    frugalScore: 100,
    description: '서울시 공공 자전거 따릉이를 대여해 강바람을 시원하게 맞으며 달리는 액티비티입니다. 잘 정돈된 한강 자전거 도로를 따라 노을을 향해 달리는 기분은 환상적입니다.',
    tip: '여의나루역 1번 출구 대여소에서 대여한 뒤 원효대교 아래 그늘 구간을 거쳐 마포대교 방향으로 질주하는 구간이 가장 시원하고 트여있어 좋습니다.',
    savings: 15000, // 사설 자전거 2인 대여 비용 대비 극대화된 절약
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'yeouido-walk',
    name: '여의도 한강공원 물빛광장 & 빛의 카페',
    category: 'walk',
    district: 'yeouido',
    districtName: '여의도/한강',
    lat: 37.5292,
    lng: 126.9274,
    costPerPerson: 0,
    rating: 4.8,
    frugalScore: 100,
    description: '워터젯 분수와 피아노물길, 그리고 한강을 배경으로 밤바람을 맞으며 로맨틱하게 쉴 수 있는 최고의 공원 공간입니다. 여름밤에는 시원한 물가에 발을 담글 수 있습니다.',
    tip: '물빛광장 앞에 앉아 건너편 여의도 마천루의 화려한 스카이라인 야경과 한강 다리의 불빛을 멍하니 바라보는 "야경 불멍"을 추천합니다.',
    savings: 20000, // 야경 스카이라운지 칵테일바 요금 대비 완벽한 힐링 및 절약
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=600&auto=format&fit=crop'
  }
];
