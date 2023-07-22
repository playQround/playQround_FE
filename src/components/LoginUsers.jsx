import { useEffect, useState } from "react";
import { API } from "../Api";
import "../css/LoginUsers.css";
import cookie from "react-cookies";
import { CSSTransition } from "react-transition-group";

const LoginUsers = ({ userInfo, ViewCreateRoom }) => {
    const Logout = () => {
        cookie.remove("authorization");
        window.location.reload();
    };

    const [rank, setRank] = useState([]);
    const [rankItem, setRankItem] = useState("userRating");
    const [rankClass, setRankClass] = useState("RankingDisplay");
    const [prevRankItem, setPrevRankItem] = useState(rankItem);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        if (rankItem !== prevRankItem) {
            setIsTransitioning(true);
            setTimeout(() => {
                setPrevRankItem(rankItem);
                setIsTransitioning(false);
            }, 4500);
        }
    }, [rankItem]);

    useEffect(() => {
        API.getUserRanking(rankItem, 5).then((res) => {
            setRank(res.data);
        });
    }, [rankItem]);

    useEffect(() => {
        const rankItemValues = ["userRating", "totalCorrect", "maxCombo"];
        const interval = setInterval(() => {
            setRankItem((prevItem) => {
                const currentIndex = rankItemValues.indexOf(prevItem);
                const nextIndex = (currentIndex + 1) % rankItemValues.length;
                return rankItemValues[nextIndex];
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className="LoginUserArea">
                <div className="UserInfoArea">
                    <p>{userInfo.userName}</p>
                    <p>{userInfo.userEmail}</p>
                    <p>Rating : {userInfo.userRating}</p>
                </div>
                <button className="LogoutButton" onClick={Logout}>
                    Log Out
                </button>

                <button className="CreateRoomButton" onClick={ViewCreateRoom}>
                    Create Room
                </button>
            </div>
            <div className="RankingTitle">현재 서버 순위</div>
            <div className={isTransitioning ? "RankingDisplay-transition" : "RankingDisplay"}>
                <span className="RankingClass">
                    {rankItem === "userRating"
                        ? "총점"
                        : rankItem === "totalCorrect"
                        ? "문제풀이 수"
                        : "콤보 수"}
                </span>
                <div className="Display">
                    {rank.map((player, rank) => {
                        let rankStyle = "";
                        let iconSrc = `${process.env.PUBLIC_URL}/out_medal.png`;

                        if (rank + 1 < 4) {
                            rankStyle = `rank${rank + 1}`;
                            iconSrc = `${process.env.PUBLIC_URL}/${rank + 1}_medal.png`;
                        }

                        if (player.userName === userInfo.userName) {
                            return (
                                <div key={rank} className={`Oneself-main ${rankStyle}`}>
                                    <img className="medal" src={iconSrc} alt={`Rank ${rank + 1}`} />
                                    {rank + 1}등&nbsp;
                                    {player.userName}님 &nbsp;
                                    {rankItem === "userRating"
                                        ? player.userRating
                                        : rankItem === "totalCorrect"
                                        ? player.totalCorrect
                                        : player.maxCombo}
                                    {rankItem === "userRating"
                                        ? "점"
                                        : rankItem === "totalCorrect"
                                        ? "개"
                                        : "번"}
                                </div>
                            );
                        } else {
                            return (
                                <div key={rank} className={`Others-main ${rankStyle}`}>
                                    <img className="medal" src={iconSrc} alt={`Rank ${rank + 1}`} />
                                    {rank + 1}등&nbsp;{player.userName}
                                    님&nbsp;
                                    {rankItem === "userRating"
                                        ? player.userRating
                                        : rankItem === "totalCorrect"
                                        ? player.totalCorrect
                                        : player.maxCombo}
                                    {rankItem === "userRating"
                                        ? "점"
                                        : rankItem === "totalCorrect"
                                        ? "개"
                                        : "번"}
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
        </>
    );
};

export default LoginUsers;
