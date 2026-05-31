// src/db.js - 하이브리드 데이터베이스 클라이언트 (Supabase & LocalStorage 어댑터)
import { createClient } from '@supabase/supabase-js';
import { dateSpots as initialDateSpots } from './dateSpots';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase 환경변수 설정 여부 진단
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Supabase 클라이언트 초기화 (설정되지 않은 경우 null)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// 초기 거지방 게시글 프리셋
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

/* ==========================================================================
   1. 데이트 스팟 (Date Spots) CRUD Operations
   ========================================================================== */

export const dbGetSpots = async () => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('poorshopmap_spots')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // 만약 DB가 비어있다면, 초기 데이터 삽입 또는 반환
      if (!data || data.length === 0) {
        return initialDateSpots;
      }
      return data;
    } catch (e) {
      console.warn('Supabase fetch spots failed, falling back to LocalStorage:', e);
    }
  }

  // Fallback: LocalStorage
  const saved = localStorage.getItem('poor_date_spots');
  return saved ? JSON.parse(saved) : initialDateSpots;
};

export const dbSaveSpot = async (newSpot) => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('poorshopmap_spots')
        .insert([{
          ...newSpot,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      return data[0];
    } catch (e) {
      console.warn('Supabase save spot failed, saving to LocalStorage:', e);
    }
  }

  // Fallback: LocalStorage
  const saved = localStorage.getItem('poor_date_spots');
  const currentSpots = saved ? JSON.parse(saved) : initialDateSpots;
  const updatedSpots = [newSpot, ...currentSpots];
  localStorage.setItem('poor_date_spots', JSON.stringify(updatedSpots));
  return newSpot;
};

/* ==========================================================================
   2. 데이트 거지방 꿀팁 (Frugal Tips) CRUD Operations
   ========================================================================== */

export const dbGetTips = async () => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('poorshopmap_tips')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!data || data.length === 0) {
        return INITIAL_TIPS;
      }
      return data;
    } catch (e) {
      console.warn('Supabase fetch tips failed, falling back to LocalStorage:', e);
    }
  }

  // Fallback: LocalStorage
  const saved = localStorage.getItem('poor_date_tips');
  return saved ? JSON.parse(saved) : INITIAL_TIPS;
};

export const dbSaveTip = async (newTip) => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('poorshopmap_tips')
        .insert([{
          ...newTip,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      return data[0];
    } catch (e) {
      console.warn('Supabase save tip failed, saving to LocalStorage:', e);
    }
  }

  // Fallback: LocalStorage
  const saved = localStorage.getItem('poor_date_tips');
  const currentTips = saved ? JSON.parse(saved) : INITIAL_TIPS;
  const updatedTips = [newTip, ...currentTips];
  localStorage.setItem('poor_date_tips', JSON.stringify(updatedTips));
  return newTip;
};

export const dbLikeTip = async (tipId, currentLikes) => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('poorshopmap_tips')
        .update({ likes: currentLikes })
        .eq('id', tipId)
        .select();

      if (error) throw error;
      return data[0];
    } catch (e) {
      console.warn('Supabase like tip failed, fallback local update:', e);
    }
  }
  return null;
};
