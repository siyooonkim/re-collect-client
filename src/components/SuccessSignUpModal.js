import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

function SuccessSignUpModal(props) {
  return (
    <div className="modalpage">
      <div className="modal">
        <div className="modal__successSignup">
          <div
            className="modal__closeBtn"
            onClick={() => {
              props.setModalMode("");
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </div>
          <div className="modal__logo"> Recollect </div>
          <p>
            환영합니다 <br /> 가입이 완료되었습니다
          </p>
          <button
            onClick={() => {
              props.setModalMode("login");
            }}
          >
            로그인하고 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessSignUpModal;