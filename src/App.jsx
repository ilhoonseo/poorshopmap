import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  Heart, 
  Map as MapIcon, 
  Sparkles, 
  MessageSquare, 
  Info, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  X, 
  Award, 
  Coins, 
  TrendingDown, 
  ThumbsUp, 
  Navigation,
  Compass,
  Check
} from 'lucide-react';
import { dateSpots as initialDateSpots } from './dateSpots';
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

// Initial community tips
const INITIAL_TIPS = [
  {
    id: 'tip-1',
    author: '홍대사랑꾼',
    category: 'walk',
    content: '홍대입구 경의선 숲길 책거리를 걷다가 연남동 골목길 초입 벤치에서 맥주 한 캔 나눠마셔 보세요! 2명이서 1만원 미만으로 웬만한 칵테일바 부럽지 않은 가을바람 낭만을 즐길 수 있습니다.',
    savings: 30000,
    likes: 42,
    date: '2026-05-30'
  },
  {
    id: 'tip-2',
    author: '대학로고인물',
    category: 'activity',
    content: '혜화 대학로에서 연극 보고 싶으시면 미리 티켓 예매하지 마시고, 당일 타임티켓 어플이나 지하철역 2번 출구 앞 티켓박스에서 마감 임박 표를 구매해 보세요! 인당 1만원대 초반에 최고의 로맨틱 코미디를 즐길 수 있습니다.',
    savings: 40000,
    likes: 38,
    date: '2026-05-29'
  },
  {
    id: 'tip-3',
    author: '한강로맨티스트',
    category: 'food',
    content: '여의도 한강공원 가실 때 2만원짜리 치킨 배달 대신 편의점에서 즉석 봉지라면 2개에 삼각김밥 사서 돗자리 펴고 드셔보세요. 한강 라면 특유의 감성이 배가 되면서 맛과 가성비 모두 챙기는 레전드 데이트가 됩니다.',
    savings: 20000,
    likes: 56,
    date: '2026-05-28'
  },
  {
    id: 'tip-4',
    author: '성수동힙스터',
    category: 'cafe',
    content: '성수동의 비싼 인스타 감성 카페들이 지겨우시다면 서울숲 야외 공원에서 따릉이 빌려 데이트하고, 메가커피나 컴포즈커피 한잔 사서 벤치에 앉아 수다 떠는 코스를 추천합니다! 자연풍이 부는 야외 테라스나 다름없습니다.',
    savings: 15000,
    likes: 24,
    date: '2026-05-27'
  }
];

function App() {
  // Views navigation state: 'map' | 'planner' | 'board' | 'about'
  const [activeTab, setActiveTab] = useState('map');
  
  // Spots database
  const [spots, setSpots] = useState(() => {
    const saved = localStorage.getItem('poor_date_spots');
    return saved ? JSON.parse(saved) : initialDateSpots;
  });

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [budgetLimit, setBudgetLimit] = useState(15000); // per person
  
  // Selected spot details state
  const [selectedSpot, setSelectedSpot] = useState(null);

  // Planner Course State
  const [courseItems, setCourseItems] = useState(() => {
    const saved = localStorage.getItem('poor_date_course');
    return saved ? JSON.parse(saved) : [];
  });

  // Frugal Tips Board State
  const [tips, setTips] = useState(() => {
    const saved = localStorage.getItem('poor_date_tips');
    return saved ? JSON.parse(saved) : INITIAL_TIPS;
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
    district: 'hongdae',
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

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('poor_date_spots', JSON.stringify(spots));
  }, [spots]);

  useEffect(() => {
    localStorage.setItem('poor_date_course', JSON.stringify(courseItems));
  }, [courseItems]);

  useEffect(() => {
    localStorage.setItem('poor_date_tips', JSON.stringify(tips));
  }, [tips]);

  useEffect(() => {
    localStorage.setItem('poor_date_liked_tips', JSON.stringify(likedTips));
  }, [likedTips]);

  // Filtering Spots logic
  const filteredSpots = spots.filter(spot => {
    const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          spot.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = selectedDistrict === 'all' || spot.district === selectedDistrict;
    const matchesCategory = selectedCategory === 'all' || spot.category === selectedCategory;
    const matchesBudget = spot.costPerPerson <= budgetLimit;
    return matchesSearch && matchesDistrict && matchesCategory && matchesBudget;
  });

  // Map Initialization Effect
  useEffect(() => {
    // Only initialize the map when activeTab is 'map' and the container is rendered
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

    // Load CartoDB Dark Matter tiles (gorgeous modern black map)
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
      // Custom Glowing DivIcon
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

      // Simple hover popup
      marker.bindPopup(`
        <div style="text-align: left; font-family: 'Outfit', sans-serif;">
          <h4 style="margin: 0 0 4px 0; font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">
            ${spot.name}
          </h4>
          <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">
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

      // Add to map layer
      markersLayerRef.current.addLayer(marker);
    });

    // Auto zoom/fit bounds if we have spots and no individual spot is selected
    if (filteredSpots.length > 0 && !selectedSpot) {
      const latlngs = filteredSpots.map(s => [s.lat, s.lng]);
      mapRef.current.fitBounds(latlngs, { padding: [50, 50], maxZoom: 14 });
    }
  }, [filteredSpots, selectedSpot]);

  // Center map on spot when clicked in sidebar
  const handleSpotCardClick = (spot) => {
    setSelectedSpot(spot);
    if (mapRef.current) {
      mapRef.current.flyTo([spot.lat, spot.lng], 15, {
        animate: true,
        duration: 1.2
      });
    }
  };

  // Planner Planner operations
  const addToCourse = (spot, e) => {
    if (e) e.stopPropagation();
    
    // Check if already exists
    if (courseItems.find(item => item.id === spot.id)) {
      alert('이미 코스에 등록된 스팟입니다!');
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

  // Tips operations
  const handleLikeTip = (tipId) => {
    if (likedTips.includes(tipId)) {
      // Unlike
      setTips(tips.map(t => t.id === tipId ? { ...t, likes: t.likes - 1 } : t));
      setLikedTips(likedTips.filter(id => id !== tipId));
    } else {
      // Like
      setTips(tips.map(t => t.id === tipId ? { ...t, likes: t.likes + 1 } : t));
      setLikedTips([...likedTips, tipId]);
    }
  };

  // Submissions handlers
  const handleReportSubmit = (e) => {
    e.preventDefault();

    if (!reportForm.name || !reportForm.costPerPerson || !reportForm.description) {
      alert('모든 필수 정보를 입력해 주세요!');
      return;
    }

    // Generate random coordinates in Seoul vicinity
    const seoulCenter = { lat: 37.556, lng: 126.978 };
    const randomOffset = () => (Math.random() - 0.5) * 0.08;

    const newSpot = {
      id: `reported-${Date.now()}`,
      name: reportForm.name,
      category: reportForm.category,
      district: reportForm.district,
      districtName: {
        hongdae: '홍대/신촌',
        seongsu: '성수/서울숲',
        hyehwa: '혜화/대학로',
        gangnam: '강남',
        yeouido: '여의도/한강'
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

    setSpots([newSpot, ...spots]);
    setShowReportModal(false);
    setReportForm({
      name: '',
      category: 'food',
      district: 'hongdae',
      costPerPerson: '',
      description: '',
      tip: ''
    });

    alert('데이트 장소가 성공적으로 제보되었습니다! 지도에 바로 등록되었습니다.');
  };

  const handleTipSubmit = (e) => {
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

    setTips([newTip, ...tips]);
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
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '6px', fontWeight: '500' }}>
              geojimap 커플에디션
            </span>
          </span>
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
                <span>코스 빌더 {courseItems.length > 0 && <span className="badge-primary" style={{ padding: '1px 6px', fontSize: '0.7rem', borderRadius: '8px', marginLeft: '4px' }}>{courseItems.length}</span>}</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('board')} 
                className={`nav-link ${activeTab === 'board' ? 'active' : ''}`}
                id="nav-board-tab"
              >
                <MessageSquare size={18} />
                <span>데이트 거지방</span>
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
        
        {/* VIEW 1: MAP INTERACTIVE DASHBOARD */}
        {activeTab === 'map' && (
          <div className="app-workspace animate-fade-in-up">
            
            {/* Sidebar with Search and Listing */}
            <aside className="sidebar-panel">
              
              {/* Filter Panel */}
              <div className="search-filter-box">
                
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

                {/* District Filter Pills */}
                <div className="filter-pills">
                  <button 
                    onClick={() => setSelectedDistrict('all')} 
                    className={`filter-pill ${selectedDistrict === 'all' ? 'active' : ''}`}
                  >
                    전체 지역
                  </button>
                  <button 
                    onClick={() => setSelectedDistrict('hyehwa')} 
                    className={`filter-pill ${selectedDistrict === 'hyehwa' ? 'active' : ''}`}
                  >
                    혜화/대학로
                  </button>
                  <button 
                    onClick={() => setSelectedDistrict('hongdae')} 
                    className={`filter-pill ${selectedDistrict === 'hongdae' ? 'active' : ''}`}
                  >
                    홍대/신촌
                  </button>
                  <button 
                    onClick={() => setSelectedDistrict('seongsu')} 
                    className={`filter-pill ${selectedDistrict === 'seongsu' ? 'active' : ''}`}
                  >
                    성수/서울숲
                  </button>
                  <button 
                    onClick={() => setSelectedDistrict('gangnam')} 
                    className={`filter-pill ${selectedDistrict === 'gangnam' ? 'active' : ''}`}
                  >
                    강남
                  </button>
                  <button 
                    onClick={() => setSelectedDistrict('yeouido')} 
                    className={`filter-pill ${selectedDistrict === 'yeouido' ? 'active' : ''}`}
                  >
                    여의도/한강
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
                  <span>나만의 알뜰 데이트 스팟 제보하기</span>
                </button>
              </div>

              {/* Spots List */}
              <div className="spot-list">
                {filteredSpots.length > 0 ? (
                  filteredSpots.map(spot => {
                    const isAdded = courseItems.some(item => item.id === spot.id);
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
                              <span className="badge badge-secondary" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                                {CATEGORY_EMOJIS[spot.category]} {spot.districtName}
                              </span>
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

            {/* Interactive Leaflet Map View */}
            <section className="map-panel">
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
                    </div>
                  </div>

                  <div className="detail-body">
                    <div className="detail-title-section">
                      <h2 className="detail-title">{selectedSpot.name}</h2>
                      <span className="badge badge-secondary" style={{ fontSize: '0.85rem' }}>
                        ⭐ Couple 평점 {selectedSpot.rating}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="detail-stats">
                      <div className="detail-stat-item" style={{ flex: 1 }}>
                        <span className="detail-stat-label">예상 지출 (2인 기준)</span>
                        <span className="detail-stat-val">{(selectedSpot.costPerPerson * 2).toLocaleString()}원</span>
                      </div>
                      <div className="detail-stat-item" style={{ flex: 1 }}>
                        <span className="detail-stat-label">절약 지수 (일반 데이트 대비)</span>
                        <span className="detail-stat-val detail-stat-val-highlight">
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
          </div>
        )}

        {/* VIEW 2: COURSE PLANNER BOARD */}
        {activeTab === 'planner' && (
          <div className="container animate-fade-in-up">
            <div className="planner-view-container">
              
              <div className="board-header">
                <div className="board-title-group">
                  <h1 style={{ margin: '0' }} className="gradient-text">나만의 1일 알뜰 데이트 코스</h1>
                  <p className="board-subtitle">스파이더 맵에서 고른 실속 플레이스들을 조합해 오늘 하루 예산과 일정을 계획해보세요.</p>
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
                            </h3>
                            <p className="planner-item-desc">{spot.description}</p>
                            <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              <span style={{ fontWeight: '700', color: 'var(--accent)' }}>인당 {spot.costPerPerson.toLocaleString()}원</span>
                              <span style={{ margin: '0 8px' }}>|</span>
                              <span>꿀팁: {spot.tip}</span>
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
                        <span className="summary-stat-label">총 방문한 장소</span>
                        <span className="summary-stat-value">{courseItems.length}곳</span>
                      </div>

                      <div className="summary-stat-row">
                        <span className="summary-stat-label">커플 총 예상비용 (2인)</span>
                        <span className="summary-stat-value-accent">{totalCost.toLocaleString()}원</span>
                      </div>

                      <div className="summary-stat-row">
                        <span className="summary-stat-label">일반 데이트 대비 아낀 금액</span>
                        <span className="summary-stat-value-savings">+{totalSavings.toLocaleString()}원</span>
                      </div>

                      {/* Progress bar representing Savings efficacy */}
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

                      {/* Couple Rating Rank Level Badge */}
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
                        <span>데이트 코스 카카오톡/링크 공유하기</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-panel empty-state" style={{ minHeight: '300px' }}>
                  <Heart size={48} className="empty-icon animate-pulse-slow" style={{ color: 'var(--primary)' }} />
                  <h2>아직 플래너가 비어 있습니다!</h2>
                  <p>데이트 지도 탭에서 마음에 드는 가성비 좋은 스팟의 <strong style={{ color: 'var(--primary)' }}>[코스추가]</strong> 버튼을 눌러 나만의 멋진 로맨틱 1일 데이트 플랜을 완성하세요.</p>
                  <button onClick={() => setActiveTab('map')} className="btn btn-primary">
                    <span>가성비 데이트 장소 찾으러 가기</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* VIEW 3: ANONYMOUS FRUGAL TIPS COMMUNITY BOARD (거지방) */}
        {activeTab === 'board' && (
          <div className="container animate-fade-in-up">
            <div className="board-view-container">
              
              <div className="board-header">
                <div className="board-title-group">
                  <h1 style={{ margin: '0' }} className="gradient-text">데이트 거지방 & 절약 위키</h1>
                  <p className="board-subtitle">지갑은 가볍게, 사랑은 로맨틱하게! 커플들이 직접 나누는 진짜 현실적인 가성비 데이트 꼼수와 꿀팁 게시판입니다.</p>
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
                          <span>약 {tip.savings.toLocaleString()}원 절약 추천!</span>
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
            <div style={{ maxWidth: '800px', margin: '48px auto', textAlign: 'left' }}>
              <div className="glass-panel" style={{ padding: '40px' }}>
                <h1 className="gradient-text" style={{ fontSize: '2.2rem', marginTop: '0', marginBottom: '20px' }}>
                  지갑은 가볍게, 사랑은 무겁게!<br />알뜰 데이트맵 프로젝트
                </h1>
                
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '24px' }}>
                  본 웹앱은 가성비 좋은 서민용 식당 제보 지도인 <strong>'거지맵(xn--v69ak0xskm.com)'</strong>을 벤치마킹하여 제작된 <strong>연인 전용 알뜰 데이트 플래너</strong>입니다.
                  물가가 치솟는 고물가 시대에 연인과의 데이트가 매번 10만원 이상의 고비용 부담으로 다가오지 않도록, 검증된 감성적이면서 가성비 훌륭한 장소만을 매칭합니다.
                </p>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '12px' }}>💡 핵심 서비스 기능</h3>
                <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  <li><strong>가성비 테마 지도:</strong> 엄선된 서울의 5대 주요 핫플레이스(혜화, 홍대, 성수, 강남, 여의도)의 식당, 카페, 문화 공간, 숲길을 테마별로 확인합니다.</li>
                  <li><strong>커플 가계부 코스 빌더:</strong> 원하는 스팟을 탭 한 번으로 골라 담아, 1일 풀코스 지출비용 및 일반 데이트 대비 세이브된 누적 절약금을 자동 계산합니다.</li>
                  <li><strong>리얼 데이트 거지방:</strong> 익명의 커플들이 꽁꽁 감춰둔 무료 전시, 가성비 주말 패스, 할인권 혜택 등 날것 그대로의 알짜 생존형 데이트 꼼수들을 투명하게 나눕니다.</li>
                  <li><strong>오픈 피드백 제보 시스템:</strong> 전국의 커플 유저들이 직접 발굴한 로컬 가성비 장소를 익명 제보하여 실시간으로 공동 업데이트 지도를 구축합니다.</li>
                </ul>

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

      </main>

      {/* Footer Section */}
      <footer className="footer">
        <div className="container footer-content">
          <div>
            <strong>알뜰 데이트맵</strong> | 커플들을 위한 가성비 명소 위키 © 2026. Inspired by 거지맵.
          </div>
          <div style={{ display: 'flex', gap: '16px', fontWeight: '600' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('about'); }}>소개</a>
            <span>•</span>
            <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
            <span>•</span>
            <a href="https://xn--v69ak0xskm.com/" target="_blank" rel="noreferrer">원조 거지맵</a>
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
                    placeholder="예: 혜화 돌쇠아저씨" 
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
                      <option value="hyehwa">혜화/대학로</option>
                      <option value="hongdae">홍대/신촌</option>
                      <option value="seongsu">성수/서울숲</option>
                      <option value="gangnam">강남</option>
                      <option value="yeouido">여의도/한강</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">1인당 예상 예산 (원) *</label>
                  <input 
                    type="number" 
                    placeholder="예: 9900" 
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
                    placeholder="예: 1만원 화덕 피자세트로 맛과 아늑함을 다 챙기는 역사 깊은 가성비 레스토랑" 
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
                    placeholder="예: 웨이팅이 심하니 주말은 피하시고, 치즈 떡볶이는 라면 추가가 꿀맛입니다." 
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
              <h2 className="modal-title">데이트 거지방 익명 꿀팁 공유</h2>
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
