import React from "react";
import { useNavigate } from "react-router-dom";
import icon from "../icons";
import { encrypt } from "../util/cryptoJs";
import { useMutation } from "react-query";
import { game } from "../api/api";

function SubHeader({ categoryName, categoryCode }) {
  const navigate = useNavigate();
  const makeRoomBtnStyle = "w-[10.54vw] h-[3.51vh]";
  const middleIconStyle = "h-[5.27vh]";
  // 메인으로 클릭 시 실행되는 함수
  const goHomeHandler = () => {
    navigate(`/`);
  };
  const goCategoryHandler = () => {
    navigate("/category");
  };

  const { mutateAsync: createRoom } = useMutation(
    () => game.createRoom(categoryCode),
    {
      onSuccess: (res) => {
        console.log(res);
      },
    }
  );

  // 방생성 함수 : 지금은 랜덤으로 생성 & 내 화면에만 표시됨으로 향후 수정 필요
  // createRoom mustation으로 들어가도록 설정 필요
  const createRoomBtnClick = async () => {
    const data = await createRoom();
    const roomData = data.data.data[0];
    const userData = encrypt({
      roomNumber: roomData.roomId,
      defaultTitle: roomData.roomName,
      categoryName,
      categoryCode,
      isTeller: true,
      isHost: true,
    });
    console.log(userData);
    sessionStorage.setItem("userData", userData);
    navigate(`/room/${roomData.roomId}`);
  };

  let categoryIcon;
  switch (categoryName) {
    case "게임/프로게이머":
      categoryIcon = null; // 향후 추가 필요
      break;
    case "연예/이슈":
      categoryIcon = (
        <icon.SubHeaderEntertainment className={middleIconStyle} />
      );
      break;
    case "스포츠/운동":
      categoryIcon = <icon.SubHeaderSports className={middleIconStyle} />;
      break;
    case "연애":
      categoryIcon = <icon.SubHeaderLove className={middleIconStyle} />;
      break;
    case "결혼/육아":
      categoryIcon = <icon.SubHeaderMarriage className={middleIconStyle} />;
      break;
    case "회사생활":
      categoryIcon = <icon.SubHeaderCompany className={middleIconStyle} />;
      break;
    case "학교생활":
      categoryIcon = <icon.SubHeaderSchool className={middleIconStyle} />;
      break;
    case "밸런스게임":
      categoryIcon = <icon.SubHeaderBalanceGame className={middleIconStyle} />;
      break;
    default:
      break;
  }
  return (
    <div className="absolute flex justify-between w-full h-[10.03vh] items-center px-[18.7vw] z-[1] backdrop-blur-[4px] bg-black-transparent transition-[background-color]">
      {categoryName ? (
        <div
          onClick={goCategoryHandler}
          className="flex items-center gap-[0.5vw] cursor-pointer"
        >
          <icon.ArrowBack className="w-[2.01vh] h-[2.01vh]" />
          <div className="text-[#C6C6C6] text-[1.25vh] font-bold">
            카테고리 선택
          </div>
        </div>
      ) : (
        <div
          onClick={goHomeHandler}
          className="flex items-center gap-[0.5vw] cursor-pointer"
        >
          <icon.ArrowBack className="w-[2.01vh] h-[2.01vh]" />
          <div className="text-[#C6C6C6] text-[1.25vh] font-bold">메인으로</div>
        </div>
      )}
      {categoryName ? (
        categoryIcon
      ) : (
        <icon.SubHeaderDefault className="h-[2.51vh]" />
      )}
      {categoryName && localStorage.getItem("kakaoId") === "1" ? (
        <icon.SubHeaderMakeRoomButton
          onClick={createRoomBtnClick}
          className={makeRoomBtnStyle + " cursor-pointer"}
        />
      ) : (
        <div className={makeRoomBtnStyle}></div>
      )}
    </div>
  );
}

export default SubHeader;