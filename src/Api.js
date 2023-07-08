import axios from "axios";
import qs from "qs";

// 중첩된 query string을 serialize
axios.defaults.paramsSerializer = (params) => qs.stringify(params);

// axios에 baseURL, header, cors 설정 등 추가
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {},
    withCredentials: false,
});

// API 목록
export const API = {
    // 방 만들기
    createRoom: (body) => api.post("/rooms", body),
    // 방 리스트 불러오기
    getRooms: () => api.get("/rooms"),
    // 단일 방 정보 불러오기(= 입장하기)
    getRoom: (selectedRoomId) => api.get(`/rooms/${selectedRoomId}`),
    // 방 검색
    searchRooms: (queryString) => api.get(`/rooms/search?${queryString}`),

    // 회원가입
    signUp: (body) => api.post("/users/signup", body),
    // 로그인
    signIn: (body) => api.post("/auth/signin", body),
    // 회원정보
    getUserInfo: (headers) => api.get("/users/info", { headers }),
};
