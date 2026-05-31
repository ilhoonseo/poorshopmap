import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  Heart, 
  Map as MapIcon, 
  Sparkles, 
  MessageSquare, 
  Info, 
  Search, 
  Plus, 
  Trash2, 
  X, 
  Award, 
  Coins, 
  ThumbsUp, 
  Compass,
  Check,
  Database,
  Sliders,
  Smile,
  Zap,
  Bookmark
} from 'lucide-react';
import { 
  dbGetSpots, 
  dbSaveSpot, 
  dbGetTips, 
  dbSaveTip, 
  dbLikeTip, 
  isSupabaseConfigured 
} from './db';
import './App.css';

// Emojis for categories
const CATEGORY_EMOJIS = {
  food: '🍝',
  cafe: '☕',
  activity: '🎡',
  walk: '🌳'
};

const CATEGORY_NAMES = {
  food: '맛집 식사',
  cafe: '감성 카페',
  activity: '이색 체험',
  walk: '낭만 산책'
};

// MBTI List
const MBTIS = [
  'ENFP', 'ENFJ', 'ENTP', 'ENTJ',
  'ESFP', 'ESFJ', 'ESTP', 'ESTJ',
  'INFP', 'INFJ', 'INTP', 'INTJ',
  'ISFP', 'ISFJ', 'ISTP', 'ISTJ'
];

// Pre-recommended Theme Course Presets
const PRESET_COURSES = [
  {
    id: 'course-seoul',
    title: '서울 혜화 레트로 야경 코스',
    region: '서울',
    spotIds: ['seoul-pizza', 'seoul-naksan'],
    description: '대학생 감성 가득! 9천원짜리 화덕피자와 치즈 떡볶이 세트로 배를 불린 뒤, 밤 조명이 은은히 성벽을 비추는 낙산공원 성곽길을 따라 최고의 도심 야경을 걷는 시그니처 무료 산책 코스.',
    emoji: '🏰',
    partnerMbti: 'INFP, INFJ, ISFP 추천'
  },
  {
    id: 'course-busan',
    title: '부산 로맨틱 오션 & 빈티지 코스',
    region: '부산',
    spotIds: ['busan-yeoul', 'busan-milk', 'busan-soobyeon'],
    description: '바다 절벽 영도 흰여울마을을 산책하고, 1940년대 적산가옥 감성 카페에서 달콤한 수제 우유를 맛본 후, 광안대교 야경 불빛 아래 수변공원 벤치에서 만원대 컵회 피크닉으로 로맨스를 꽃피우는 오션뷰 풀코스.',
    emoji: '🌊',
    partnerMbti: 'ENFP, ESFP, ENFJ 추천'
  },
  {
    id: 'course-incheon',
    title: '인천 이국적 선셋 수상택시 코스',
    region: '경기/인천',
    spotIds: ['gyeonggi-hwasung', 'gyeonggi-taxi'],
    description: '역사적인 성곽길을 탐방하고, 고층 빌딩 숲 사이에 펼쳐진 이국적인 송도 센트럴 호수공원에서 단돈 4,000원에 수상택시를 타고 환상적인 골든아워 석양 조명을 감상하는 고품격 선셋 데이트.',
    emoji: '⛵',
    partnerMbti: 'ISTJ, INTJ, ESTJ 추천'
  },
  {
    id: 'course-daejeon',
    title: '대전 음악분수 & 성심당 맛투어 코스',
    region: '대전/충청',
    spotIds: ['daejeon-bread', 'daejeon-fountain'],
    description: '대한민국 최고 가성비 빵집 성심당에서 맛있는 소보로와 빵들을 저렴하게 골라담아 맛보고, 밤에는 엑스포 과학공원에서 100% 무료로 운영되는 화려한 레이저 춤추는 분수쇼 명당을 점하는 실속 최강 데이트.',
    emoji: '🍞',
    partnerMbti: 'ENTP, INTP, ESTP 추천'
  }
];

// MBTI description generators
const getMbtiDescription = (mbti) => {
  if (!mbti || mbti.length !== 4) return '우리 커플의 MBTI 유형을 선택해 맞춤형 데이트 스팟을 알아보세요!';
  
  const [E_I, S_N, T_F, J_P] = mbti.toUpperCase().split('');
  
  const trait1 = E_I === 'E' 
    ? '활동적이고 생동감 넘치는 야외 코스를 즐기는 에너지 충만형'
    : '차분하고 아늑한 조용한 둘만의 실내 공간을 좋아하는 힐링 감성형';
    
  const trait2 = S_N === 'S'
    ? '오감을 직접 자극하는 확실한 가성비 맛집과 직관적인 액티비티를 선호하고'
    : '아날로그 정취와 역사, 독창적인 예술품들이 깃든 문화 공간과 골목길에 매료되며';
    
  const trait3 = T_F === 'T'
    ? '지갑 사정에 최적화된 높은 가치와 실속 있는 동선 설계를 중시하는 스마트 러버'
    : '아름다운 도심 노을과 호숫가 야경, 감미로운 멜로디에 눈물짓는 로맨틱 감성가';
    
  const trait4 = J_P === 'J'
    ? '이며, 동선과 타임테이블이 확실하고 깔끔하게 정돈된 클래식 코스'
    : '이며, 즉흥적이고 편안하게 발길 닿는 대로 유유자적 떠나는 피크닉';

  return `✨ ${mbti} 커플 특징: ${trait1} 커플! ${trait2}, ${trait3}${trait4} 데이트가 찰떡궁합입니다. 💕`;
};

// Dynamic MBTI matching score calculator
const getMbtiScore = (mbti, spot) => {
  if (!mbti || mbti.length !== 4) return 0;
  
  const [E_I, S_N, T_F, J_P] = mbti.toUpperCase().split('');
  let score = 70; // Base score

  if (spot.category === 'walk') {
    if (E_I === 'I') score += 10;
    if (S_N === 'N') score += 5;
    if (T_F === 'F') score += 10;
    if (J_P === 'P') score += 4;
  } 
  else if (spot.category === 'cafe') {
    if (E_I === 'I') score += 10;
    if (S_N === 'N') score += 8;
    if (T_F === 'F') score += 8;
    if (J_P === 'J') score += 3;
  } 
  else if (spot.category === 'activity') {
    if (E_I === 'E') score += 12;
    if (S_N === 'S') score += 10;
    if (J_P === 'J' && spot.id.includes('sky')) score += 5;
    if (J_P === 'P' && !spot.id.includes('sky')) score += 5;
  } 
  else if (spot.category === 'food') {
    if (E_I === 'E') score += 5;
    if (S_N === 'S') score += 12;
    if (T_F === 'T') score += 8;
    if (J_P === 'P' && spot.id.includes('ramen')) score += 4;
  }

  return Math.min(99, score);
};

function App() {
  // Views navigation state: 'map' | 'planner' | 'board' | 'about'
  const [activeTab, setActiveTab] = useState('map');
  
  // Mobile responsive views toggle for Map screen: 'list' (장소 목록) | 'map' (풀 스크린 지도)
  const [mobileView, setMobileView] = useState('list');

  // Spots & Tips state loaded from hybrid DB
  const [spots, setSpots] = useState([]);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [budgetLimit, setBudgetLimit] = useState(15000); // per person
  
  // MBTI Recommendation States
  const [selectedMbti, setSelectedMbti] = useState(() => {
    return localStorage.getItem('poor_date_mbti') || '';
  });
  const [onlyMbtiRecommended, setOnlyMbtiRecommended] = useState(false);
  
  // Selected spot details state
  const [selectedSpot, setSelectedSpot] = useState(null);

  // Planner Course State (always local to each couple for customized privacy)
  const [courseItems, setCourseItems] = useState(() => {
    const saved = localStorage.getItem('poor_date_course');
    return saved ? JSON.parse(saved) : [];
  });

  // Liked state to prevent duplicate likes
  const [likedTips, setLikedTips] = useState(() => {
    const saved = localStorage.getItem('poor_date_liked_tips');
    return saved ? JSON.parse(saved) : [];
  });

  // Modals state
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAddTipModal, setShowAddTipModal] = useState(false);

  // Form states
  const [reportForm, setReportForm] = useState({
    name: '',
    category: 'food',
    district: 'seoul',
    costPerPerson: '',
    description: '',
    tip: ''
  });

  const [tipForm, setTipForm] = useState({
    nickname: '',
    category: 'food',
    content: '',
    savings: ''
  });

  // Leaflet Map Refs
  const mapRef = useRef(null);
  const markersLayerRef = useRef(null);

  // Load spots and tips from Hybrid DB on mount
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const fetchedSpots = await dbGetSpots();
        const fetchedTips = await dbGetTips();
        setSpots(fetchedSpots);
        setTips(fetchedTips);
      } catch (err) {
        console.error('Error loading hybrid DB data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Save Local Course Items and MBTI selection
  useEffect(() => {
    localStorage.setItem('poor_date_course', JSON.stringify(courseItems));
  }, [courseItems]);

  useEffect(() => {
    localStorage.setItem('poor_date_liked_tips', JSON.stringify(likedTips));
  }, [likedTips]);

  useEffect(() => {
    if (selectedMbti) {
      localStorage.setItem('poor_date_mbti', selectedMbti);
    } else {
      localStorage.removeItem('poor_date_mbti');
    }
  }, [selectedMbti]);

  // Leaflet map tile rendering error solver inside display:none toggle
  useEffect(() => {
    if (activeTab === 'map' && mobileView === 'map' && mapRef.current) {
      const timer = setTimeout(() => {
        mapRef.current.invalidateSize({ animate: true });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [mobileView, activeTab]);

  // Filtering Spots logic + MBTI Match filter
  const filteredSpots = spots.filter(spot => {
    const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          spot.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = selectedDistrict === 'all' || spot.district === selectedDistrict;
    const matchesCategory = selectedCategory === 'all' || spot.category === selectedCategory;
    const matchesBudget = spot.costPerPerson <= budgetLimit;
    
    const mbtiScore = selectedMbti ? getMbtiScore(selectedMbti, spot) : 0;
    const matchesMbtiOnly = !onlyMbtiRecommended || (selectedMbti && mbtiScore >= 90);

    return matchesSearch && matchesDistrict && matchesCategory && matchesBudget && matchesMbtiOnly;
  });

  // Map Initialization Effect
  useEffect(() => {
    if (activeTab !== 'map') {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      return;
    }

    const mapContainer = document.getElementById('map-container');
    if (!mapContainer || mapRef.current) return;

    // Initialize Map at central Seoul coordinates
    const map = L.map('map-container', {
      zoomControl: true,
      attributionControl: true
    }).setView([37.556, 126.978], 12);

    mapRef.current = map;

    // Load CartoDB Dark Matter tiles (gorgeous dark aesthetics)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Initialize Layer Group for Markers
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [activeTab]);

  // Populate Map Markers Effect
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    // Clear existing markers
    markersLayerRef.current.clearLayers();

    // Add new markers
    filteredSpots.forEach(spot => {
      const markerHtml = `
        <div class="custom-marker marker-${spot.category}" style="font-size: 1.4rem;">
          ${CATEGORY_EMOJIS[spot.category]}
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'leaflet-custom-marker-wrapper',
        iconSize: [42, 42],
        iconAnchor: [21, 21],
        popupAnchor: [0, -20]
      });

      const marker = L.marker([spot.lat, spot.lng], { icon: customIcon });

      // Click event
      marker.on('click', () => {
        setSelectedSpot(spot);
        mapRef.current.flyTo([spot.lat, spot.lng], 15, {
          animate: true,
          duration: 1.2
        });
      });

      marker.bindPopup(`
        <div style="text-align: left; font-family: 'Outfit', sans-serif;">
          <h4 style="margin: 0 0 4px 0; font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">
            ${spot.name}
          </h4>
          <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">
            ${CATEGORY_NAMES[spot.category]} • ${spot.districtName}
          </span>
          <div style="margin-top: 6px; font-weight: 700; color: var(--accent); font-size: 0.85rem;">
            인당 ${spot.costPerPerson.toLocaleString()}원
          </div>
        </div>
      `, {
        closeButton: false,
        offset: L.point(0, -10)
      });

      markersLayerRef.current.addLayer(marker);
    });

    // Auto zoom/fit bounds if spots exist and no spot is selected
    if (filteredSpots.length > 0 && !selectedSpot) {
      const latlngs = filteredSpots.map(s => [s.lat, s.lng]);
      mapRef.current.fitBounds(latlngs, { padding: [40, 40], maxZoom: 14 });
    }
  }, [filteredSpots, selectedSpot]);

  // Center map on spot when clicked in list
  const handleSpotCardClick = (spot) => {
    setSelectedSpot(spot);
    setMobileView('map');
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
        mapRef.current.flyTo([spot.lat, spot.lng], 15, {
          animate: true,
          duration: 1.2
        });
      }, 100);
    }
  };

  // Planner Course Operations
  const addToCourse = (spot, e) => {
    if (e) e.stopPropagation();
    
    if (courseItems.find(item => item.id === spot.id)) {
      alert('이미 코스에 등록된 장소입니다!');
      return;
    }

    setCourseItems([...courseItems, spot]);
  };

  const removeFromCourse = (spotId, e) => {
    if (e) e.stopPropagation();
    setCourseItems(courseItems.filter(item => item.id !== spotId));
  };

  const clearCourse = () => {
    if (window.confirm('계획된 1일 데이트 코스를 초기화하시겠습니까?')) {
      setCourseItems([]);
    }
  };

  // Load Preset Course Helper
  const loadPresetCourse = (spotIds) => {
    const selectedSpots = [];
    spotIds.forEach(id => {
      const match = spots.find(s => s.id === id);
      if (match) selectedSpots.push(match);
    });

    if (selectedSpots.length > 0) {
      setCourseItems(selectedSpots);
      alert('🎁 전국 베스트 테마 코스가 플래너에 성공적으로 세팅되었습니다! 예산 지표와 데이트 꿀팁을 분석해 보세요.');
    } else {
      alert('추천 코스 장소들을 로드할 수 없습니다. 맵 데이터를 재설정해 주세요.');
    }
  };

  // Tips operations
  const handleLikeTip = async (tipId) => {
    let updatedLikes = 0;
    const isLiked = likedTips.includes(tipId);
    
    const updatedTips = tips.map(t => {
      if (t.id === tipId) {
        updatedLikes = isLiked ? t.likes - 1 : t.likes + 1;
        return { ...t, likes: updatedLikes };
      }
      return t;
    });
    
    setTips(updatedTips);
    
    if (isLiked) {
      setLikedTips(likedTips.filter(id => id !== tipId));
    } else {
      setLikedTips([...likedTips, tipId]);
    }
    
    await dbLikeTip(tipId, updatedLikes);
  };

  // Submissions handlers
  const handleReportSubmit = async (e) => {
    e.preventDefault();

    if (!reportForm.name || !reportForm.costPerPerson || !reportForm.description) {
      alert('모든 필수 정보를 입력해 주세요!');
      return;
    }

    const seoulCenter = { lat: 37.556, lng: 126.978 };
    const randomOffset = () => (Math.random() - 0.5) * 0.08;

    const newSpot = {
      id: `reported-${Date.now()}`,
      name: reportForm.name,
      category: reportForm.category,
      district: reportForm.district,
      districtName: {
        seoul: '서울',
        gyeonggi: '경기/인천',
        busan: '부산',
        daegu: '대구/경북',
        daejeon: '대전/충청',
        gwangju: '광주/전라',
        gangwon: '강원/제주'
      }[reportForm.district],
      lat: seoulCenter.lat + randomOffset(),
      lng: seoulCenter.lng + randomOffset(),
      costPerPerson: parseInt(reportForm.costPerPerson, 10),
      rating: 4.5,
      frugalScore: Math.min(100, Math.floor(80 + Math.random() * 20)),
      description: reportForm.description,
      tip: reportForm.tip || '익명 연인이 남긴 알뜰 제보 스팟입니다.',
      savings: Math.floor(15000 + Math.random() * 20000),
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop'
    };

    const savedSpot = await dbSaveSpot(newSpot);
    setSpots([savedSpot, ...spots]);
    
    setShowReportModal(false);
    setReportForm({
      name: '',
      category: 'food',
      district: 'seoul',
      costPerPerson: '',
      description: '',
      tip: ''
    });

    alert('데이트 장소가 성공적으로 제보되었습니다! 지도에 바로 등록되었습니다.');
  };

  const handleTipSubmit = async (e) => {
    e.preventDefault();

    if (!tipForm.nickname || !tipForm.content || !tipForm.savings) {
      alert('모든 필수 항목을 기입해 주세요!');
      return;
    }

    const newTip = {
      id: `tip-${Date.now()}`,
      author: tipForm.nickname,
      category: tipForm.category,
      content: tipForm.content,
      savings: parseInt(tipForm.savings, 10),
      likes: 0,
      date: new Date().toISOString().split('T')[0]
    };

    const savedTip = await dbSaveTip(newTip);
    setTips([savedTip, ...tips]);
    
    setShowAddTipModal(false);
    setTipForm({
      nickname: '',
      category: 'food',
      content: '',
      savings: ''
    });

    alert('알뜰 데이트 꿀팁이 공유되었습니다!');
  };

  // Calculations for Planner View
  const totalCost = courseItems.reduce((acc, item) => acc + item.costPerPerson * 2, 0);
  const totalSavings = courseItems.reduce((acc, item) => acc + item.savings, 0);

  // Evaluate couple level title
  let coupleLevel = { icon: '🌱', name: '알뜰 데이트 입문자' };
  if (courseItems.length > 0) {
    if (totalCost <= 20000) {
      coupleLevel = { icon: '👑', name: '가성비 신의 경지' };
    } else if (totalCost <= 40000) {
      coupleLevel = { icon: '💖', name: '로맨틱 낭만 실속파' };
    } else if (totalCost <= 60000) {
      coupleLevel = { icon: '☕', name: '센스 만점 데이트 플래너' };
    } else {
      coupleLevel = { icon: '✨', name: '합리적인 소비 지향 커플' };
    }
  }

  return (
    <div id="root">
      {/* Navbar Section */}
      <header className="navbar">
        <div className="logo-container">
          <Heart className="logo-icon animate-pulse-slow" size={26} fill="var(--primary)" />
          <span className="logo-title">
            <span className="gradient-text">알뜰 데이트맵</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px', fontWeight: '500' }} className="version-label">
              전국 에디션
            </span>
          </span>
        </div>

        {/* Dynamic DB indicator badge */}
        <div className="db-badge">
          {isSupabaseConfigured ? (
            <span className="badge badge-accent" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
              <Database size={10} style={{ marginRight: '4px' }} /> 중앙 DB 연결됨
            </span>
          ) : (
            <span className="badge" style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)' }}>
              🔒 로컬 저장 모드
            </span>
          )}
        </div>

        <nav>
          <ul className="nav-menu">
            <li>
              <button 
                onClick={() => setActiveTab('map')} 
                className={`nav-link ${activeTab === 'map' ? 'active' : ''}`}
                id="nav-map-tab"
              >
                <MapIcon size={18} />
                <span>데이트 지도</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('planner')} 
                className={`nav-link ${activeTab === 'planner' ? 'active' : ''}`}
                id="nav-planner-tab"
              >
                <Sparkles size={18} />
                <span>코스 빌더 {courseItems.length > 0 && <span className="badge-primary-circle">{courseItems.length}</span>}</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('board')} 
                className={`nav-link ${activeTab === 'board' ? 'active' : ''}`}
                id="nav-board-tab"
              >
                <MessageSquare size={18} />
                <span>데이트 꿀팁방</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('about')} 
                className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
                id="nav-about-tab"
              >
                <Info size={18} />
                <span>맵 소개</span>
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: '1' }}>
        
        {loading ? (
          <div className="empty-state" style={{ minHeight: '300px' }}>
            <Heart className="empty-icon animate-pulse-slow" size={48} style={{ color: 'var(--primary)' }} />
            <h2>가성비 데이트 데이터를 가져오는 중...</h2>
            <p>전국 하이브리드 연동 로딩 중입니다.</p>
          </div>
        ) : (
          <>
            {/* VIEW 1: MAP INTERACTIVE DASHBOARD */}
            {activeTab === 'map' && (
              <div className="app-workspace animate-fade-in-up">
                
                {/* Sidebar - Hidden on mobile if map view is active */}
                <aside className={`sidebar-panel ${mobileView === 'map' ? 'mobile-hidden' : ''}`}>
                  
                  {/* MBTI Compatibility Widget Section */}
                  <div className="glass-panel" style={{ margin: '16px', padding: '16px', background: 'rgba(255, 74, 122, 0.04)', border: '1px solid rgba(255, 74, 122, 0.15)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <Smile size={18} color="var(--primary)" />
                      <h4 style={{ fontSize: '0.9rem', fontWeight: '800' }}>🧬 우리 커플 MBTI 케미 스팟</h4>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <select 
                        className="form-control" 
                        style={{ padding: '6px 12px', fontSize: '0.8rem', height: '34px', background: 'rgba(9,9,11,0.6)' }}
                        value={selectedMbti}
                        onChange={(e) => {
                          setSelectedMbti(e.target.value);
                          if (!e.target.value) setOnlyMbtiRecommended(false);
                        }}
                        id="mbti-selector"
                      >
                        <option value="">우리의 MBTI 선택...</option>
                        {MBTIS.map(mbti => (
                          <option key={mbti} value={mbti}>{mbti}</option>
                        ))}
                      </select>

                      {selectedMbti && (
                        <button
                          onClick={() => setOnlyMbtiRecommended(!onlyMbtiRecommended)}
                          className={`btn ${onlyMbtiRecommended ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ padding: '6px 12px', fontSize: '0.75rem', height: '34px', borderRadius: 'var(--radius-md)', whiteSpace: 'nowrap' }}
                        >
                          {onlyMbtiRecommended ? '전체 장소' : '매칭 스팟만'}
                        </button>
                      )}
                    </div>

                    <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: '0', textAlign: 'left' }}>
                      {getMbtiDescription(selectedMbti)}
                    </p>
                  </div>

                  {/* Filter Panel */}
                  <div className="search-filter-box" style={{ borderTop: '1px solid var(--border)' }}>
                    
                    {/* Search */}
                    <div className="search-input-wrapper">
                      <Search className="search-icon" size={18} />
                      <input 
                        type="text" 
                        placeholder="맛집, 카페, 장소 검색..." 
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        id="spot-search-field"
                      />
                    </div>

                    {/* Nationwide District Filter Pills */}
                    <div className="filter-pills">
                      <button 
                        onClick={() => setSelectedDistrict('all')} 
                        className={`filter-pill ${selectedDistrict === 'all' ? 'active' : ''}`}
                      >
                        전체 지역
                      </button>
                      <button 
                        onClick={() => setSelectedDistrict('seoul')} 
                        className={`filter-pill ${selectedDistrict === 'seoul' ? 'active' : ''}`}
                      >
                        서울
                      </button>
                      <button 
                        onClick={() => setSelectedDistrict('gyeonggi')} 
                        className={`filter-pill ${selectedDistrict === 'gyeonggi' ? 'active' : ''}`}
                      >
                        경기/인천
                      </button>
                      <button 
                        onClick={() => setSelectedDistrict('busan')} 
                        className={`filter-pill ${selectedDistrict === 'busan' ? 'active' : ''}`}
                      >
                        부산
                      </button>
                      <button 
                        onClick={() => setSelectedDistrict('daegu')} 
                        className={`filter-pill ${selectedDistrict === 'daegu' ? 'active' : ''}`}
                      >
                        대구/경북
                      </button>
                      <button 
                        onClick={() => setSelectedDistrict('daejeon')} 
                        className={`filter-pill ${selectedDistrict === 'daejeon' ? 'active' : ''}`}
                      >
                        대전/충청
                      </button>
                      <button 
                        onClick={() => setSelectedDistrict('gwangju')} 
                        className={`filter-pill ${selectedDistrict === 'gwangju' ? 'active' : ''}`}
                      >
                        광주/전라
                      </button>
                      <button 
                        onClick={() => setSelectedDistrict('gangwon')} 
                        className={`filter-pill ${selectedDistrict === 'gangwon' ? 'active' : ''}`}
                      >
                        강원/제주
                      </button>
                    </div>

                    {/* Category Filter Icons */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => setSelectedCategory('all')} 
                        className={`btn btn-secondary ${selectedCategory === 'all' ? 'active' : ''}`}
                        style={{ flex: 1, padding: '6px 0', fontSize: '0.8rem', minHeight: '36px', borderColor: selectedCategory === 'all' ? 'var(--primary)' : '' }}
                      >
                        전체종류
                      </button>
                      {Object.keys(CATEGORY_EMOJIS).map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`btn btn-secondary ${selectedCategory === cat ? 'active' : ''}`}
                          style={{ flex: 1, padding: '6px 0', fontSize: '0.8rem', minHeight: '36px', borderColor: selectedCategory === cat ? 'var(--primary)' : '' }}
                        >
                          {CATEGORY_EMOJIS[cat]} {CATEGORY_NAMES[cat].split(' ')[1]}
                        </button>
                      ))}
                    </div>

                    {/* Budget Slider */}
                    <div style={{ textAlign: 'left', marginTop: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                        <span>1인당 예상 예산 한도</span>
                        <span className="gradient-text">{budgetLimit.toLocaleString()}원 이하</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="20000" 
                        step="1000" 
                        value={budgetLimit}
                        onChange={(e) => setBudgetLimit(parseInt(e.target.value, 10))}
                        style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer', marginTop: '6px' }}
                        id="budget-range-slider"
                      />
                    </div>

                    {/* Fast Report Trigger */}
                    <button 
                      onClick={() => setShowReportModal(true)} 
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                      id="open-report-modal"
                    >
                      <Plus size={16} />
                      <span>나만의 가성비 데이트 스팟 제보하기</span>
                    </button>
                  </div>

                  {/* Spots List */}
                  <div className="spot-list">
                    {filteredSpots.length > 0 ? (
                      filteredSpots.map(spot => {
                        const isAdded = courseItems.some(item => item.id === spot.id);
                        const mbtiScore = selectedMbti ? getMbtiScore(selectedMbti, spot) : 0;
                        const isMbtiHighlyMatched = mbtiScore >= 90;

                        return (
                          <div 
                            key={spot.id} 
                            onClick={() => handleSpotCardClick(spot)}
                            className={`glass-panel spot-card ${selectedSpot && selectedSpot.id === spot.id ? 'selected' : ''}`}
                          >
                            <img src={spot.image} alt={spot.name} className="spot-card-img" />
                            <div className="spot-card-content">
                              <div>
                                <div className="spot-card-header">
                                  <h3 className="spot-card-title">{spot.name}</h3>
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                    <span className="badge badge-secondary" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                                      {CATEGORY_EMOJIS[spot.category]} {spot.districtName}
                                    </span>
                                    {selectedMbti && (
                                      <span 
                                        className={`badge ${isMbtiHighlyMatched ? 'badge-primary' : 'badge-accent'}`} 
                                        style={{ fontSize: '0.65rem', padding: '1px 6px', fontWeight: '800', animation: isMbtiHighlyMatched ? 'pulse-slow 2s infinite' : 'none' }}
                                      >
                                        💝 {selectedMbti} {mbtiScore}%
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <p className="spot-card-desc">{spot.description}</p>
                              </div>
                              
                              <div className="spot-card-footer">
                                <span className="spot-price">인당 {spot.costPerPerson.toLocaleString()}원</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    isAdded ? removeFromCourse(spot.id, e) : addToCourse(spot, e);
                                  }}
                                  className={`btn ${isAdded ? 'btn-secondary' : 'btn-primary'}`}
                                  style={{ 
                                    padding: '4px 10px', 
                                    borderRadius: 'var(--radius-sm)', 
                                    fontSize: '0.75rem',
                                    color: isAdded ? 'var(--text-secondary)' : 'white'
                                  }}
                                >
                                  {isAdded ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                      <Check size={12} /> 추가됨
                                    </span>
                                  ) : (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                      <Plus size={12} /> 코스추가
                                    </span>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="empty-state">
                        <Compass size={40} className="empty-icon animate-pulse-slow" />
                        <p style={{ fontSize: '0.9rem' }}>해당 조건에 맞는 데이트 장소가 없습니다.<br />예산 한도를 늘리거나 필터를 조절해보세요!</p>
                      </div>
                    )}
                  </div>
                </aside>

                {/* Map - Hidden on mobile if list view is active */}
                <section className={`map-panel ${mobileView === 'list' ? 'mobile-hidden' : ''}`}>
                  <div id="map-container" className="map-container-instance"></div>

                  {/* Detail Popup Overlay */}
                  {selectedSpot && (
                    <div className="glass-panel detail-overlay-panel animate-fade-in-up">
                      <div className="detail-img-header">
                        <img src={selectedSpot.image} alt={selectedSpot.name} className="detail-img" />
                        <div className="detail-img-gradient"></div>
                        <button 
                          onClick={() => setSelectedSpot(null)} 
                          className="detail-close-btn"
                        >
                          <X size={18} color="white" />
                        </button>
                        <div className="detail-badge-group">
                          <span className="badge badge-primary">
                            {CATEGORY_EMOJIS[selectedSpot.category]} {CATEGORY_NAMES[selectedSpot.category]}
                          </span>
                          <span className="badge badge-accent">
                            📍 {selectedSpot.districtName}
                          </span>
                          {selectedMbti && (
                            <span className="badge badge-primary" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', border: 'none' }}>
                              💝 {selectedMbti} 매치 {getMbtiScore(selectedMbti, selectedSpot)}%
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="detail-body">
                        <div className="detail-title-section">
                          <h2 className="detail-title">{selectedSpot.name}</h2>
                          <span className="badge badge-secondary" style={{ fontSize: '0.85rem' }}>
                            ⭐ 커플 평점 {selectedSpot.rating}
                          </span>
                        </div>

                        {/* Stats */}
                        <div className="detail-stats">
                          <div className="detail-stat-item" style={{ flex: 1 }}>
                            <span className="detail-stat-label">예상 지출 (2인 기준)</span>
                            <span className="detail-stat-val">{(selectedSpot.costPerPerson * 2).toLocaleString()}원</span>
                          </div>
                          <div className="detail-stat-item" style={{ flex: 1 }}>
                            <span className="detail-stat-label">절약 지수 (일반 대조)</span>
                            <span className="detail-stat-val detail-stat-val-highlight" style={{ fontSize: '0.85rem' }}>
                              약 {selectedSpot.savings.toLocaleString()}원 절약!
                            </span>
                          </div>
                          <div className="detail-stat-item" style={{ flex: 0.8 }}>
                            <span className="detail-stat-label">가성비 평가 점수</span>
                            <span className="detail-stat-val" style={{ color: 'var(--accent)' }}>
                              🔥 {selectedSpot.frugalScore}점
                            </span>
                          </div>
                        </div>

                        <p className="detail-desc">{selectedSpot.description}</p>

                        {/* Romantic Date Hack */}
                        <div className="detail-tip-box">
                          <h4 className="detail-tip-title">
                            <Sparkles size={14} />
                            <span>낭만 200% 알뜰 데이트 꿀팁!</span>
                          </h4>
                          <p className="detail-tip-content">{selectedSpot.tip}</p>
                        </div>

                        {/* Actions */}
                        <div className="detail-actions">
                          {courseItems.some(item => item.id === selectedSpot.id) ? (
                            <button 
                              onClick={(e) => removeFromCourse(selectedSpot.id, e)} 
                              className="btn btn-secondary" 
                              style={{ flex: 1 }}
                            >
                              <Trash2 size={16} />
                              <span>데이트 코스에서 제외</span>
                            </button>
                          ) : (
                            <button 
                              onClick={(e) => addToCourse(selectedSpot, e)} 
                              className="btn btn-primary" 
                              style={{ flex: 1 }}
                            >
                              <Plus size={16} />
                              <span>나만의 1일 데이트 코스에 추가</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* Floating Mobile Toggle Button */}
                <button 
                  className="mobile-toggle-btn btn btn-primary"
                  onClick={() => setMobileView(mobileView === 'list' ? 'map' : 'list')}
                  id="mobile-view-toggle"
                >
                  {mobileView === 'list' ? <MapIcon size={18} /> : <Search size={18} />}
                  <span>{mobileView === 'list' ? '지도로 보기' : '장소목록 보기'}</span>
                </button>
              </div>
            )}

            {/* VIEW 2: COURSE PLANNER BOARD */}
            {activeTab === 'planner' && (
              <div className="container animate-fade-in-up">
                <div className="planner-view-container">
                  
                  <div className="board-header">
                    <div className="board-title-group">
                      <h1 style={{ margin: '0' }} className="gradient-text">나만의 1일 알뜰 데이트 코스</h1>
                      <p className="board-subtitle">데이트 지도에서 가성비 스팟을 고르거나 아래의 전국 테마 추천 코스를 탭 한 번으로 바로 불러와 가계부를 짜보세요.</p>
                    </div>
                    {courseItems.length > 0 && (
                      <button onClick={clearCourse} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                        <Trash2 size={16} style={{ color: 'var(--primary)' }} />
                        <span>코스 전체 비우기</span>
                      </button>
                    )}
                  </div>

                  {courseItems.length > 0 ? (
                    <div className="planner-layout">
                      {/* Timeline list */}
                      <div className="planner-timeline">
                        {courseItems.map((spot, idx) => (
                          <div key={spot.id} className="glass-panel planner-timeline-item">
                            <div className="planner-timeline-index">{idx + 1}</div>
                            <div className="planner-timeline-content">
                              <div className="planner-timeline-details">
                                <h3 className="planner-item-title">
                                  {spot.name}
                                  <span className="badge badge-secondary" style={{ fontSize: '0.7rem', padding: '1px 8px' }}>
                                    {CATEGORY_EMOJIS[spot.category]} {spot.districtName}
                                  </span>
                                  {selectedMbti && (
                                    <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '1px 6px', fontWeight: '800' }}>
                                      💝 {selectedMbti} {getMbtiScore(selectedMbti, spot)}%
                                    </span>
                                  )}
                                </h3>
                                <p className="planner-item-desc">{spot.description}</p>
                                <div className="planner-item-subinfo">
                                  <span style={{ fontWeight: '700', color: 'var(--accent)' }}>인당 {spot.costPerPerson.toLocaleString()}원</span>
                                  <span className="subinfo-divider">|</span>
                                  <span className="subinfo-tip">꿀팁: {spot.tip}</span>
                                </div>
                              </div>
                              <div className="planner-timeline-action">
                                <button 
                                  onClick={(e) => removeFromCourse(spot.id, e)} 
                                  className="btn btn-secondary"
                                  style={{ padding: '8px', borderRadius: 'var(--radius-sm)' }}
                                  title="코스에서 빼기"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Summary Dashboard widget */}
                      <div className="planner-sidebar">
                        <div className="glass-panel summary-card">
                          <h2 className="summary-title">
                            <Award size={22} color="var(--primary)" />
                            <span>오늘의 데이트 가계부</span>
                          </h2>

                          <div className="summary-stat-row">
                            <span className="summary-stat-label">총 방문 장소</span>
                            <span className="summary-stat-value">{courseItems.length}곳</span>
                          </div>

                          <div className="summary-stat-row">
                            <span className="summary-stat-label">커플 예상 총 지출 (2인)</span>
                            <span className="summary-stat-value-accent">{totalCost.toLocaleString()}원</span>
                          </div>

                          <div className="summary-stat-row">
                            <span className="summary-stat-label">일반 데이트 대비 절감액</span>
                            <span className="summary-stat-value-savings">+{totalSavings.toLocaleString()}원</span>
                          </div>

                          {/* Progress bar */}
                          <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              <span>알뜰 지갑 세이브 지수</span>
                              <span style={{ fontWeight: '700', color: 'var(--accent)' }}>
                                {Math.min(100, Math.floor((totalSavings / (totalCost + totalSavings || 1)) * 100))}%
                              </span>
                            </div>
                            <div className="savings-progress-bar">
                              <div 
                                className="savings-progress-fill"
                                style={{ width: `${Math.min(100, Math.floor((totalSavings / (totalCost + totalSavings || 1)) * 100))}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Couple Level badge */}
                          <div className="couple-level-card">
                            <div className="level-icon">{coupleLevel.icon}</div>
                            <div className="level-info">
                              <div className="level-title">데이트 기획자 등급</div>
                              <div className="level-name">{coupleLevel.name}</div>
                            </div>
                          </div>

                          <button 
                            onClick={() => {
                              alert(`🎉 코스 저장 완료! \n\n방문지: ${courseItems.map((s, i) => `${i+1}. ${s.name}`).join(', ')} \n총 예상 예산: ${totalCost.toLocaleString()}원 \n일반 데이트 대비 총 ${totalSavings.toLocaleString()}원을 세이브했습니다!`);
                            }} 
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '20px' }}
                          >
                            <span>데이트 코스 공유하기</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="glass-panel empty-state" style={{ minHeight: '260px', padding: '32px' }}>
                      <Heart size={48} className="empty-icon animate-pulse-slow" style={{ color: 'var(--primary)' }} />
                      <h2>아직 플래너가 비어 있습니다!</h2>
                      <p>아래에서 **알뜰 데이트맵 MD가 직접 검증한 전국 가성비 추천 코스**를 로드해보거나, <br />지도로 이동해 마음에 드는 개별 스팟의 <strong style={{ color: 'var(--primary)' }}>[코스추가]</strong> 버튼을 누르세요.</p>
                      <button onClick={() => setActiveTab('map')} className="btn btn-primary">
                        <span>장소 고르러 지도로 가기</span>
                      </button>
                    </div>
                  )}

                  {/* PRESET RECOMMENDATIONS GRID SECTION (Tab 2 Bottom) */}
                  <div style={{ marginTop: '40px', borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', textAlign: 'left' }}>
                      <Bookmark size={22} color="var(--primary)" />
                      <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0' }}>🎁 알뜰 데이트맵 MD 강추! 베스트 테마 코스</h2>
                    </div>

                    <div className="grid-two-cols">
                      {PRESET_COURSES.map(course => (
                        <div 
                          key={course.id} 
                          className="glass-panel" 
                          style={{ padding: '20px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid var(--border)' }}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                              <h3 style={{ fontSize: '1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '1.3rem' }}>{course.emoji}</span>
                                <span>{course.title}</span>
                              </h3>
                              <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>
                                {course.region}
                              </span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px' }}>
                              {course.description}
                            </p>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '8px' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: '700' }}>
                              👉 {course.partnerMbti}
                            </span>
                            <button
                              onClick={() => loadPresetCourse(course.spotIds)}
                              className="btn btn-primary"
                              style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
                            >
                              <Zap size={12} /> 코스 불러오기
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* VIEW 3: ANONYMOUS FRUGAL TIPS BOARD */}
            {activeTab === 'board' && (
              <div className="container animate-fade-in-up">
                <div className="board-view-container">
                  
                  <div className="board-header">
                    <div className="board-title-group">
                      <h1 style={{ margin: '0' }} className="gradient-text">데이트 꿀팁방 & 절약 위키</h1>
                      <p className="board-subtitle">커플들이 직접 밝히는 로맨틱하면서 지갑이 굳는 숨은 꼼수와 생활비 절약 팁 게시판입니다.</p>
                    </div>
                    <button 
                      onClick={() => setShowAddTipModal(true)} 
                      className="btn btn-primary"
                      id="open-add-tip-modal"
                    >
                      <Plus size={18} />
                      <span>익명 꿀팁 공유하기</span>
                    </button>
                  </div>

                  {/* Tips cards grid */}
                  <div className="grid-responsive">
                    {tips.map(tip => {
                      const hasLiked = likedTips.includes(tip.id);
                      return (
                        <div key={tip.id} className="glass-panel tip-card">
                          <div>
                            <div className="tip-card-header">
                              <div className="tip-author-info">
                                <div className="tip-author-avatar">
                                  {tip.author.charAt(0)}
                                </div>
                                <div>
                                  <div className="tip-author-name">{tip.author}</div>
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{tip.date}</div>
                                </div>
                              </div>
                              <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                                {CATEGORY_EMOJIS[tip.category] || '💡'} {CATEGORY_NAMES[tip.category] || '꿀팁'}
                              </span>
                            </div>
                            <p className="tip-content">"{tip.content}"</p>
                          </div>

                          <div className="tip-card-footer">
                            <span className="tip-savings-badge">
                              <Coins size={14} />
                              <span>약 {tip.savings.toLocaleString()}원 절약!</span>
                            </span>
                            
                            <button 
                              onClick={() => handleLikeTip(tip.id)}
                              className={`tip-like-btn ${hasLiked ? 'liked' : ''}`}
                            >
                              <ThumbsUp size={14} fill={hasLiked ? 'var(--primary)' : 'none'} />
                              <span>{tip.likes}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>
            )}

            {/* VIEW 4: ABOUT PAGE */}
            {activeTab === 'about' && (
              <div className="container animate-fade-in-up">
                <div style={{ maxWidth: '800px', margin: '48px auto', textAlign: 'left' }} className="about-wrapper">
                  <div className="glass-panel" style={{ padding: '40px' }}>
                    <h1 className="gradient-text" style={{ fontSize: '2.2rem', marginTop: '0', marginBottom: '20px' }}>
                      지갑은 가볍게, 사랑은 무겁게!<br />알뜰 데이트맵 프로젝트
                    </h1>
                    
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '24px' }}>
                      본 웹앱은 연인들을 위한 <strong>전국 단위 가성비 데이트 플래너 & 지도 플랫폼</strong>입니다.
                      물가가 치솟는 고물가 시대에 연인과의 데이트가 매번 10만원 이상의 고비용 부담으로 다가오지 않도록, 검증된 감성적이면서 가성비 훌륭한 전국의 실속 명소들을 매칭합니다.
                    </p>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '12px' }}>💡 핵심 서비스 기능</h3>
                    <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                      <li><strong>전국 가성비 테마 지도:</strong> 엄선된 전국 7대 광역 시도(서울, 경기/인천, 부산, 대구/경북, 대전/충청, 광주/전라, 강원/제주)의 식당, 카페, 체험관, 수변공원을 지도 위에서 바로 탐색합니다.</li>
                      <li><strong>🧬 MBTI 맞춤형 추천 엔진:</strong> 커플의 MBTI 유형을 입력받아 데이트 성향 카드를 분석하고, 마커마다 70%~99% 범위의 개별 성향 호환 지수를 실시간으로 연동 계산합니다.</li>
                      <li><strong>🎁 프리셋 테마 코스 지원:</strong> 서울, 인천, 부산, 대전 등 1일 최고의 호평을 받는 테마 연인 코스를 원클릭으로 플래너에 장착하는 올인원 스케줄링을 지원합니다.</li>
                      <li><strong>리얼 데이트 꿀팁방:</strong> 익명의 커플들이 꽁꽁 감춰둔 무료 전시, 가성비 주말 패스, 할인권 혜택 등 날것 그대로의 알짜 생존형 데이트 꼼수들을 투명하게 나눕니다.</li>
                    </ul>

                    {/* Database status widget */}
                    <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', margin: '20px 0' }}>
                      <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '1rem', fontWeight: '700' }}>
                        <Database size={18} color="var(--primary)" />
                        <span>데이터베이스 연결 현황</span>
                      </h4>
                      {isSupabaseConfigured ? (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          🟢 **Supabase 실시간 중앙 서버 DB가 온라인 상태입니다.** 전 세계 모든 유저들이 익명 제보한 스팟과 데이트 꿀팁이 한 곳에 모여 즉시 저장 및 공유됩니다.
                        </p>
                      ) : (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          🟡 **안전 로컬 저장 모드로 작동 중입니다.** Vercel 설정 또는 로컬 환경에 Supabase 환경변수(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)를 추가해 주시면 자동으로 중앙 공유형 클라우드 플랫폼으로 즉시 업그레이드됩니다.
                        </p>
                      )}
                    </div>

                    <div className="couple-level-card" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'var(--border)' }}>
                      <div style={{ fontSize: '2rem' }}>💖</div>
                      <div>
                        <h4 style={{ fontWeight: '800' }}>"사랑은 지출액에 비례하지 않습니다."</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>진정한 데이트의 가치는 비싼 파스타 식당이나 호텔 라운지가 아닌, 마주 앉아 나누는 진솔한 눈빛과 소소한 발걸음에 있습니다. 알뜰 데이트맵이 두 분의 실속 있고 로맨틱한 동행을 지원합니다!</p>
                      </div>
                    </div>

                    <div style={{ marginTop: '32px', textAlign: 'center' }}>
                      <button onClick={() => setActiveTab('map')} className="btn btn-primary">
                        <span>지금 바로 데이트 지도 시작하기</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

      </main>

      {/* Footer Section */}
      <footer className="footer">
        <div className="container footer-content">
          <div>
            <strong>알뜰 데이트맵</strong> | 전국 커플들을 위한 가성비 명소 위키 © 2026.
          </div>
          <div style={{ display: 'flex', gap: '16px', fontWeight: '600' }} className="footer-links">
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('about'); }}>소개</a>
            <span>•</span>
            <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>
      </footer>

      {/* MODAL 1: REPORT NEW ALREADY DATE SPOT MODAL */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header">
              <h2 className="modal-title">나만의 알뜰 데이트 스팟 제보</h2>
              <button onClick={() => setShowReportModal(false)} className="modal-close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReportSubmit}>
              <div className="modal-body">
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  커플 여러분이 직접 가보신 알뜰하고 로맨틱한 맛집, 카페, 놀거리를 제보해 주세요. 검토 후 지도에 무료로 반영됩니다! (좌표는 예시로 서울 중심부에 자동 배치됩니다.)
                </p>

                <div className="form-group">
                  <label className="form-label">장소 이름 *</label>
                  <input 
                    type="text" 
                    placeholder="예: 경포호 자전거길" 
                    className="form-control"
                    required
                    value={reportForm.name}
                    onChange={(e) => setReportForm({ ...reportForm, name: e.target.value })}
                    id="report-spot-name"
                  />
                </div>

                <div className="grid-two-cols">
                  <div className="form-group">
                    <label className="form-label">종류 *</label>
                    <select 
                      className="form-control"
                      value={reportForm.category}
                      onChange={(e) => setReportForm({ ...reportForm, category: e.target.value })}
                      id="report-spot-category"
                    >
                      <option value="food">🍝 맛집 식사</option>
                      <option value="cafe">☕ 감성 카페</option>
                      <option value="activity">🎡 이색 체험</option>
                      <option value="walk">🌳 낭만 산책</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">해당 지역 *</label>
                    <select 
                      className="form-control"
                      value={reportForm.district}
                      onChange={(e) => setReportForm({ ...reportForm, district: e.target.value })}
                      id="report-spot-district"
                    >
                      <option value="seoul">서울</option>
                      <option value="gyeonggi">경기/인천</option>
                      <option value="busan">부산</option>
                      <option value="daegu">대구/경북</option>
                      <option value="daejeon">대전/충청</option>
                      <option value="gwangju">광주/전라</option>
                      <option value="gangwon">강원/제주</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">1인당 예상 예산 (원) *</label>
                  <input 
                    type="number" 
                    placeholder="예: 3000" 
                    className="form-control"
                    required
                    value={reportForm.costPerPerson}
                    onChange={(e) => setReportForm({ ...reportForm, costPerPerson: e.target.value })}
                    id="report-spot-budget"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">한줄 장소 설명 *</label>
                  <textarea 
                    rows="2"
                    placeholder="예: 호수 조망을 바라보며 시원하게 3,000원에 달리는 가성비 자전거 일주 코스" 
                    className="form-control"
                    required
                    value={reportForm.description}
                    onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                    id="report-spot-desc"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">나만의 데이트 꿀팁 (선택)</label>
                  <textarea 
                    rows="2"
                    placeholder="예: 공공 자전거 대여소를 이용하시면 사설 대여 샵보다 무려 5배 저렴하게 자전거를 빌릴 수 있습니다." 
                    className="form-control"
                    value={reportForm.tip}
                    onChange={(e) => setReportForm({ ...reportForm, tip: e.target.value })}
                    id="report-spot-tip"
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowReportModal(false)} className="btn btn-secondary">
                  취소
                </button>
                <button type="submit" className="btn btn-primary" id="submit-report-form">
                  제보 완료
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: ADD ANONYMOUS TIPS BOARD POST MODAL */}
      {showAddTipModal && (
        <div className="modal-overlay" onClick={() => setShowAddTipModal(false)}>
          <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header">
              <h2 className="modal-title">데이트 꿀팁방 익명 꿀팁 공유</h2>
              <button onClick={() => setShowAddTipModal(false)} className="modal-close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleTipSubmit}>
              <div className="modal-body">
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  다른 연인들과 공유하고 싶은 나만의 실속 절약형 데이트 생존 팁이나 할인 구매 노하우를 익명으로 적어주세요.
                </p>

                <div className="grid-two-cols">
                  <div className="form-group">
                    <label className="form-label">닉네임 *</label>
                    <input 
                      type="text" 
                      placeholder="예: 실속러브" 
                      className="form-control"
                      required
                      value={tipForm.nickname}
                      onChange={(e) => setTipForm({ ...tipForm, nickname: e.target.value })}
                      id="tip-form-nickname"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">분류 *</label>
                    <select 
                      className="form-control"
                      value={tipForm.category}
                      onChange={(e) => setTipForm({ ...tipForm, category: e.target.value })}
                      id="tip-form-category"
                    >
                      <option value="food">🍝 맛집 식사</option>
                      <option value="cafe">☕ 감성 카페</option>
                      <option value="activity">🎡 이색 체험</option>
                      <option value="walk">🌳 낭만 산책</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">추천 꿀팁 상세설명 *</label>
                  <textarea 
                    rows="4"
                    placeholder="예: 코엑스 별마당도서관은 무료 입장이라 연중무휴 책을 같이 골라주고 대화하기 좋습니다. 오후 2시에는 무료 라이브 클래식 공연도 열리니 스케줄 맞춰 가면 1원 한 장 없이 최고의 힐링을 챙길 수 있습니다." 
                    className="form-control"
                    required
                    value={tipForm.content}
                    onChange={(e) => setTipForm({ ...tipForm, content: e.target.value })}
                    id="tip-form-content"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">총 절약된 예상 금액 (원) *</label>
                  <input 
                    type="number" 
                    placeholder="예: 25000" 
                    className="form-control"
                    required
                    value={tipForm.savings}
                    onChange={(e) => setTipForm({ ...tipForm, savings: e.target.value })}
                    id="tip-form-savings"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddTipModal(false)} className="btn btn-secondary">
                  취소
                </button>
                <button type="submit" className="btn btn-primary" id="submit-tip-form">
                  꿀팁 공유 완료
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;
